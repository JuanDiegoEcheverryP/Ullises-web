import { Component } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Arco } from '../model/arco';
import { Mantenimiento } from '../model/mantenimiento';
import { PrestamoArco } from '../model/prestamoArco';

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

  constructor(private firebaseService: FirebaseService) {
    // Inicializa Firebase cuando se crea este componente
  }

  ngOnInit(): void {
    this.obtenerArcos()
    // Inicializar los arrays de visualización
    this.showMantenimiento = new Array(this.listaArcos.length).fill(false);
    this.showHistorial = new Array(this.listaArcos.length).fill(false);
  }

  async obtenerArcos() {
    let tmp = await this.firebaseService.getAllDataFromCollection("Arcos");

    const arcos: Arco[] = tmp.map(element => new Arco(
      element.id,
      element.calidad,
      element.estado,
      element.libraje,
      element.tipo,
      element.mano,
      element.mantenimiento.map((m: { fecha: string; empleadoId: number; concepto: string; }) => new Mantenimiento(
        m.fecha,
        m.empleadoId,
        m.concepto
      )),
      element.historial.map((h: { fecha: string; sedeId: number; arqueroId: number; }) => new PrestamoArco(
        h.fecha, 
        h.sedeId, 
        h.arqueroId 
      ))
    ));

    this.listaArcos  = arcos
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
}
