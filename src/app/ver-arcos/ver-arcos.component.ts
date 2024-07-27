import { Component } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Arco } from '../model/arco';
import { Mantenimiento } from '../model/mantenimiento';
import { PrestamoArco } from '../model/prestamoArco';
import { ActivatedRoute, Router } from '@angular/router';
import {SharedServiceService} from '../shared/shared-service.service'

@Component({
  selector: 'app-ver-arcos',
  templateUrl: './ver-arcos.component.html',
  styleUrls: ['./ver-arcos.component.css']
})
export class VerArcosComponent {
  public cargado: boolean = false

  public listaArcos: Arco[] = [];
  showMantenimiento: boolean[] = [];
  showHistorial: boolean[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private SharedServiceService: SharedServiceService) {
    
  }

  ngOnInit(): void {
    this.obtenerArcos()
    // Inicializar los arrays de visualización
    this.showMantenimiento = new Array(this.listaArcos.length).fill(false);
    this.showHistorial = new Array(this.listaArcos.length).fill(false);
  }

  async obtenerArcos() {
    this.listaArcos  = await this.SharedServiceService.withTimeout(this.SharedServiceService.arcosBuild(), 5000); // 5 seconds timeout
    this.listaArcos.sort((a, b) => a.id - b.id);
    this.cargado = true;
    console.log(this.listaArcos);
    
  }

  toggleSection(index: number, section: string): void {
    if (section === 'mantenimiento') {
      this.showMantenimiento[index] = !this.showMantenimiento[index];
    } else if (section === 'historial') {
      this.showHistorial[index] = !this.showHistorial[index];
    }
  }

  editarArco(id:number) {
    sessionStorage.setItem('arcoId', id.toString());
    this.router.navigate([`editar-arco`]);
  }

  
}
