import { Component } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import {SharedServiceService} from '../shared/shared-service.service'
import { ActivatedRoute, Router } from '@angular/router';
import { Arco } from '../model/arco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Mantenimiento } from '../model/mantenimiento';

@Component({
  selector: 'app-mantenimiento-paca',
  templateUrl: './mantenimiento-paca.component.html',
  styleUrls: ['./mantenimiento-paca.component.css']
})
export class MantenimientoPacaComponent {
   //Popup
   actualizado: boolean = false;
   isPopupVisible: boolean = false;
   popupTitle: string = '';
   popupMessage: string = '';
 
   public cargado: boolean = false
 
    public idPaca: string | null = '';

    constructor(private firebaseService: FirebaseService, 
      private router: Router,
      private SharedServiceService: SharedServiceService,
      private snackBar: MatSnackBar,
      private route: ActivatedRoute) {
    }
  
    async ngOnInit(): Promise<void> {
      this.idPaca = sessionStorage.getItem('pacaId');
      this.cargado = true;
    }
  
    async enviar() {
      const enviarButton = document.getElementById('enviarButton') as HTMLButtonElement;
      enviarButton.disabled = true;
  
      const fechaSeleccionada = (document.getElementById('fecha') as HTMLInputElement).value;
      const conceptoSeleccionado = (document.getElementById('concepto') as HTMLInputElement)?.value;
  
      if (!fechaSeleccionada || !conceptoSeleccionado) {
        this.popupTitle = 'Información faltante';
        this.popupMessage = 'Seleccione la fecha y complete el concepto';
        this.showPopup();
        enviarButton.disabled = false;
        return;
      }
  
      if (!this.idPaca) {
        console.error("Error: ID de arco no definido");
        return;
      }
  
      const history = new Mantenimiento(fechaSeleccionada, -1, conceptoSeleccionado);
      const jsonString = JSON.stringify(history);
      const newObj = JSON.parse(jsonString);
  
      try {
        await this.firebaseService.addToArrayInDocument("Pacas", this.idPaca, "mantenimiento", newObj);
        this.SharedServiceService.updatePacasCode();
        this.actualizado = true;
        this.actualizadoPopup();
        // Redireccionar tras mostrar el popup, asumiendo que este método manejará la navegación
      } catch (error) {
        console.error("Error al añadir documento: ", error);
        enviarButton.disabled = false;
      }
    }
  
    openSnackBar(message: string, action: string = 'Cerrar') {
      this.snackBar.open(message, action, {
        duration: 1000, // duración del snackbar en milisegundos
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
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
