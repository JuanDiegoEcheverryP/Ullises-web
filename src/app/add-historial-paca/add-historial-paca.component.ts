import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { Paca } from '../model/paca';
import {SharedServiceService} from '../shared/shared-service.service'
import { UbicacionCampo } from '../model/ubicacionCampo';

@Component({
  selector: 'app-add-historial-paca',
  templateUrl: './add-historial-paca.component.html',
  styleUrls: ['./add-historial-paca.component.css']
})
export class AddHistorialPacaComponent {

  //Popup
  actualizado: boolean = false;
  isPopupVisible: boolean = false;
  popupTitle: string = '';
  popupMessage: string = '';

  actual: Paca = new Paca(-1,"Null")
  idPaca = ''
  tipoPaca = "s"

  sedes = this.SharedServiceService.getSedes()
  distancias = this.SharedServiceService.getDistancias()
  ubicaciones = this.SharedServiceService.getUbicaciones()
  
  constructor(private firebaseService: FirebaseService, 
    private router: Router,
    private SharedServiceService: SharedServiceService) {
    // Inicializa Firebase cuando se crea este componente
  }

  

  async ngOnInit(): Promise<void> {
    const idPaca = sessionStorage.getItem('pacaId');
    const tipoPaca = sessionStorage.getItem('tipoPaca');
  
    this.idPaca = idPaca !== null ? idPaca : ''; // Asigna un string vacío si es null
    this.tipoPaca = tipoPaca !== null ? tipoPaca : ''; // Asigna un string vacío si es null

    this.actual  = await this.SharedServiceService.withTimeout(this.SharedServiceService.pacaBuild(this.idPaca), 5000); // 5 seconds timeout


  }

  Agregar(event: Event) {
    event.preventDefault(); // Previene el envío del formulario
    const fechaSeleccionada = (document.getElementById('fecha') as HTMLInputElement).value;
    const inputSede = (document.getElementById('sede') as HTMLInputElement).value;
    const inputDistancia = (document.getElementById('distancia') as HTMLInputElement).value;
    const inputUbicacioni = (document.getElementById('ubicacion') as HTMLInputElement).value;
    
    const history = new UbicacionCampo(Number(inputDistancia),inputUbicacioni,inputSede,fechaSeleccionada);

    this.actual.historialCampo?.push(history)

    this.SharedServiceService.updatePacasCode()
    const jsonString = JSON.stringify(this.actual);
    let newObj = JSON.parse(jsonString);
    this.firebaseService.addDocument("Pacas",this.actual.id.toString(),newObj)
    
    console.log('Fecha seleccionada:', fechaSeleccionada);

    this.actualizadoPopup()
    this.actualizado = true
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
