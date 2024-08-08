import { Component } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Arco } from '../model/arco';
import { Mantenimiento } from '../model/mantenimiento';
import { PrestamoArco } from '../model/prestamoArco';
import { Paca } from '../model/paca';
import { UbicacionCampo } from '../model/ubicacionCampo';
import { Router } from '@angular/router';
import {SharedServiceService} from '../shared/shared-service.service'
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ver-pacas',
  templateUrl: './ver-pacas.component.html',
  styleUrls: ['./ver-pacas.component.css']
})
export class VerPacasComponent {

  public cargado: boolean = false

  public listaPacas: Paca[] = [];
  showMantenimiento: boolean[] = [];
  showHistorial: boolean[] = [];

  constructor(private firebaseService: FirebaseService,
    private router: Router,
    private SharedServiceService: SharedServiceService,
    private snackBar: MatSnackBar
  ) {
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
    this.showMantenimiento = new Array(this.listaPacas.length).fill(false);
    this.showHistorial = new Array(this.listaPacas.length).fill(false);
  }

  async obtenerPacas() {
    this.listaPacas.sort((a, b) => a.id - b.id);
    this.cargado = true;
    console.log(this.listaPacas);
    
  }

  toggleSection(index: number, section: string): void {
    if (section === 'mantenimiento') {
      this.showMantenimiento[index] = !this.showMantenimiento[index];
    } else if (section === 'historial') {
      this.showHistorial[index] = !this.showHistorial[index];
    }
  }

  addCampo(id:number,tipo:string) {
    sessionStorage.setItem('pacaId', id.toString());
    sessionStorage.setItem('tipoPaca', tipo);
    this.router.navigate([`add-historial-paca`]);
  }

  openSnackBar(message: string, action: string = 'Cerrar') {
    this.snackBar.open(message, action, {
      duration: 3000, // duración del snackbar en milisegundos
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
