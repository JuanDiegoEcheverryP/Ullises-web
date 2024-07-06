import { Component } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Arco } from '../model/arco';
import { Mantenimiento } from '../model/mantenimiento';
import { PrestamoArco } from '../model/prestamoArco';
import { Paca } from '../model/paca';
import { UbicacionCampo } from '../model/ubicacionCampo';

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

  constructor(private firebaseService: FirebaseService) {
    // Inicializa Firebase cuando se crea este componente
  }

  ngOnInit(): void {
    this.obtenerPacas()
    this.showMantenimiento = new Array(this.listaPacas.length).fill(false);
    this.showHistorial = new Array(this.listaPacas.length).fill(false);
  }

  async obtenerPacas() {
    let tmp = await this.firebaseService.getAllDataFromCollection("Pacas");

    const pacas: Paca[] = tmp.map(element => new Paca(
      element.id,
      element.tipo,
      element.ubicacion,
      element.sede,
      element.estado,
      element.mantenimiento.map((m: { fecha: string; empleadoId: number; concepto: string; }) => new Mantenimiento(
        m.fecha,
        m.empleadoId,
        m.concepto
      )),
      element.historialCampo.map((h: { fecha: string; pacaId: number, sedeId: number, ubicacion: string, distancia: number}) => new UbicacionCampo(
        h.distancia,
        h.ubicacion,
        h.sedeId,
        h.fecha,
        h.pacaId
      ))
    ));

    this.listaPacas  = pacas
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
}
