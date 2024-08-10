import { Component, AfterViewChecked } from '@angular/core';
import { SharedServiceService } from '../shared/shared-service.service';
import { FirebaseService } from '../services/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
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
export class ArmarCampoComponent implements AfterViewChecked {
  public code: string = '';
  
  // Popup
  actualizado: boolean = false;
  isPopupVisible: boolean = false;
  popupTitle: string = '';
  popupMessage: string = '';

  public cargado: boolean = false;

  sedes = this.SharedServiceService.getSedes();
  distancias = this.SharedServiceService.getDistancias();
  ubicaciones = this.SharedServiceService.getUbicaciones();

  public listaPacas: Paca[] = [];
  public listaPacaSelection: PacaSelection[] = [];

  private dataLoaded: boolean = false;

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private SharedServiceService: SharedServiceService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.listaPacas = await this.SharedServiceService.setSessionPacas();
    this.obtenerPacas();

    this.route.queryParams.subscribe(params => {
      this.code = params['code'];
    });
    
    if (this.code) {
      await this.cargarConCodigo();
    }
  }

  ngAfterViewChecked(): void {
    // Establecer valores una vez que los datos y el DOM estén listos
    if (this.dataLoaded) {
      this.applySelectionData();
      this.dataLoaded = false; // Para evitar que se ejecute repetidamente
    }
  }

  async cargarConCodigo() {
    const fechaSeleccionada = document.getElementById('fecha') as HTMLInputElement;
    const inputSede = document.getElementById('sede') as HTMLInputElement;
  
    const datos = await this.firebaseService.getData("toStage", this.code);
    console.log(datos);
  
    if (datos !== null) {
      fechaSeleccionada.value = datos['fecha'];
      inputSede.value = datos['sede'];
  
      datos['pacas'].forEach((element: any) => {
        this.listaPacaSelection.forEach(element2 => {
          if (element.id == element2.paca.id.toString()) {
            element2.seleccionada = true;
            console.log(element);
            
            element2.distancia = element['distancia'];
            element2.ubicacion = element['ubicacion'];
          }
        });
      });

      this.dataLoaded = true;
    } else {
      this.router.navigate(["/"]);
    }
  }

  private applySelectionData() {
    this.listaPacaSelection.forEach(element2 => {
      if (element2.seleccionada) {
        const checkbox = document.getElementById('checkbox-' + element2.paca.id) as HTMLInputElement;
        const distancia = document.getElementById('distancia-' + element2.paca.id) as HTMLSelectElement;
        const ubicacion = document.getElementById('ubicacion-' + element2.paca.id) as HTMLSelectElement;

        if (checkbox) {
          checkbox.checked = true;
        }

        if (distancia) {
          distancia.value = element2.distancia;
        }

        if (ubicacion) {
          ubicacion.value = element2.ubicacion;
        }
      }
    });
  }

  async obtenerPacas() {
    this.listaPacas.sort((a, b) => a.id - b.id);
    this.cargado = true;
    console.log(this.listaPacas);

    this.listaPacaSelection = this.listaPacas.map(paca => ({
      paca,
      seleccionada: false,
      distancia: '',
      ubicacion: ''
    }));
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

  async enviar() {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Bogota',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    const colombiaTime = now.toLocaleTimeString('en-US', options);

    const fechaSeleccionada = (document.getElementById('fecha') as HTMLInputElement).value;
    const inputSede = (document.getElementById('sede') as HTMLInputElement).value;

    if (fechaSeleccionada == "") {
      this.popupTitle = 'Información faltante';
      this.popupMessage = 'Seleccione la fecha';
      this.showPopup();
      return;
    } else if (inputSede == "") {
      this.popupTitle = 'Información faltante';
      this.popupMessage = 'Seleccione la sede';
      this.showPopup();
      return;
    }

    let filtradas = this.listaPacaSelection.filter(paca => paca.seleccionada);

    if (filtradas.length == 0) {
      this.popupTitle = 'Información faltante';
      this.popupMessage = 'Seleccione las pacas del campo';
      this.showPopup();
      return;
    }

    filtradas.forEach(element => {
      if (element.distancia == "" || element.ubicacion == "") {
        this.popupTitle = 'Información incorrecta';
        this.popupMessage = 'Hay campos sin llenar';
        this.showPopup();
        return;
      }
    });

    filtradas.forEach(async element => {
      const history = new UbicacionCampo(
        Number(element.distancia),
        element.ubicacion,
        inputSede,
        fechaSeleccionada
      );
      element.paca.historialCampo?.push(history);

      const jsonString = JSON.stringify(history);
      let newObj = JSON.parse(jsonString);
    });

    const plainPacas = filtradas.map(item => ({
      id: item.paca.id,
      distancia: item.distancia,
      ubicacion: item.ubicacion
    }));

    let codigo  = ''
    if(this.code) {
      codigo = this.code
    }
    else {
      codigo = await this.SharedServiceService.crearCodigoHash()
    }
    this.firebaseService
      .addDocument("toStage", codigo, {
        actualizado: colombiaTime,
        Autor: "DB",
        tipo: "Campo Pacas",
        sede: inputSede,
        fecha: fechaSeleccionada,
        pacas: plainPacas
      })
      .then(() => {
        this.SharedServiceService.updateArcosCode();
        this.actualizado = true;
        this.actualizadoPopup();
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      });

    this.SharedServiceService.updatePacasCode();
    this.actualizado = true;
    this.actualizadoPopup();
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
    this.showPopup();
  }
}
