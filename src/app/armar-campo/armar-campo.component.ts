import { Component } from '@angular/core';
import {SharedServiceService} from '../shared/shared-service.service'
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { Paca } from '../model/paca';
import { UbicacionCampo } from '../model/ubicacionCampo';

interface PacaSelection {
  paca: Paca;
  distancia: string;
  ubicacion: string;
  seleccionada: boolean;
}

@Component({
  selector: 'app-armar-campo',
  templateUrl: './armar-campo.component.html',
  styleUrls: ['./armar-campo.component.css']
})
export class ArmarCampoComponent {

  //Popup
  actualizado: boolean = false;
  isPopupVisible: boolean = false;
  popupTitle: string = '';
  popupMessage: string = '';

  public cargado: boolean = false

  sedes = this.SharedServiceService.getSedes()
  distancias = this.SharedServiceService.getDistancias()
  ubicaciones = this.SharedServiceService.getUbicaciones()


  public listaPacas: Paca[] = [];
  public listaPacaSelection: PacaSelection[] = [];

  constructor(private firebaseService: FirebaseService, 
    private router: Router,
    private SharedServiceService: SharedServiceService) {
    // Inicializa Firebase cuando se crea este componente
  }

  async ngOnInit(): Promise<void> {
    if (await this.SharedServiceService.checkNewPacas()) {
      const pacasString = sessionStorage.getItem('pacas');
      if (pacasString) {
        this.listaPacas = JSON.parse(pacasString) as Paca[];
      } else {
        this.listaPacas = await this.SharedServiceService.withTimeout(this.SharedServiceService.pacasBuild(), 5000); // 5 seconds timeout
        sessionStorage.setItem('pacas', JSON.stringify(this.listaPacas));
      }
    } else {
      this.listaPacas = await this.SharedServiceService.withTimeout(this.SharedServiceService.pacasBuild(), 5000); // 5 seconds timeout
      sessionStorage.setItem('pacas', JSON.stringify(this.listaPacas));
    }

    this.obtenerPacas()
  }

  async obtenerPacas() {
    this.listaPacas.sort((a, b) => a.id - b.id);
    this.cargado = true;
    console.log(this.listaPacas);

    this.listaPacaSelection = this.listaPacas.map(paca => ({ paca, seleccionada: false, distancia: '', ubicacion: '' }));
  }

  toggleSeleccion(pacaSelection: PacaSelection) {
    pacaSelection.seleccionada = !pacaSelection.seleccionada;
    console.log(this.listaPacaSelection);
  }

  updateDistancia(pacaSelection: PacaSelection, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    pacaSelection.distancia = selectElement.value;
    console.log(this.listaPacaSelection);
    
  }

  updateUbicacion(pacaSelection: PacaSelection, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    pacaSelection.ubicacion = selectElement.value;
    console.log(this.listaPacaSelection);
    
  }

  enviar() {
    const fechaSeleccionada = (document.getElementById('fecha') as HTMLInputElement).value;
    const inputSede = (document.getElementById('sede') as HTMLInputElement).value;

    if (fechaSeleccionada == "" ) {
      this.popupTitle = 'Información faltante';
      this.popupMessage = 'Seleccione la fecha';
      this.showPopup()
    }
    else if (inputSede == "") {
      this.popupTitle = 'Información faltante';
      this.popupMessage = 'Seleccione la sede';
      this.showPopup()
    }

    let filtradas = this.listaPacaSelection.filter(paca => paca.seleccionada);

    if (filtradas.length == 0) {
      this.popupTitle = 'Información faltante';
      this.popupMessage = 'Seleccione las pacas del campo';
      this.showPopup()
    }

    filtradas.forEach(element => {
      if (element.distancia == "" || element.ubicacion == "") {
        
        this.popupTitle = 'Información incorrecta';
        this.popupMessage = 'Hay campos sin llenar';
        this.showPopup()
        return
      }
    });
    
    filtradas.forEach(element => {
      const history = new UbicacionCampo(Number(element.distancia),element.ubicacion,inputSede,fechaSeleccionada);
      element.paca.historialCampo?.push(history)

      const jsonString = JSON.stringify(history);
      let newObj = JSON.parse(jsonString);

      this.firebaseService.addToArrayInDocument("Pacas", element.paca.id.toString(), 'historialCampo', newObj)
      .then(() => {
        console.log('Valor añadido con éxito al arreglo');
      })
      .catch((error) => {
        console.error('Error añadiendo valor al arreglo: ', error);
      })
    });
    
    this.SharedServiceService.updatePacasCode()
    this.actualizado = true
    this.actualizadoPopup()
  }


  showPopup() {
    this.isPopupVisible = true;
  }

  onPopupClose() {
    this.isPopupVisible = false;

    if (this.actualizado) {
      this.router.navigate(['/menu']);
    }
  }

  actualizadoPopup() {
    this.popupTitle = 'Información actualizada';
    this.popupMessage = 'Agregado al historial';
    this.showPopup()
  }
}
