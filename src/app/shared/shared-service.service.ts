import { Injectable } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Arco } from '../model/arco';
import { Mantenimiento } from '../model/mantenimiento';
import { PrestamoArco } from '../model/prestamoArco';
import { Paca } from '../model/paca';
import { UbicacionCampo } from '../model/ubicacionCampo';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  constructor(private firebaseService: FirebaseService) {
  }

  async arcoBuild(idArco: string): Promise<Arco> {
    let bow = new Arco(-1);
    let data = await this.firebaseService.getData("Arcos", idArco);
    if (data) {
      let bow = new Arco(
        data['id'],
        data['calidad'] || undefined,
        data['estado'] || undefined,
        data['libraje'] || undefined,
        data['tipo'] || undefined,
        data['mano'] || undefined,
        data['estadoCuerda'] || undefined,
        data['estadoRest'] || undefined,
        data['estadoPalas'] || undefined,
        data['estadoPintura'] || undefined,
        data['mantenimiento'] || [],
        data['historial'] || []
      );
      return bow
    }

    return bow;
  }

  async arcosBuild(): Promise<Arco[]> {
    let tmp = await this.firebaseService.getAllDataFromCollection("Arcos");

    const arcos: Arco[] = tmp.map(element => new Arco(
      element.id,
      element.calidad,
      element.estado,
      element.libraje,
      element.tipo,
      element.mano,
      element.estadoCuerda,
      element.estadoRest,
      element.estadoPalas,
      element.estadoPintura,
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
    return arcos
  }

  async pacaBuild(idPaca: string): Promise<Paca> {
    let paca = new Paca(-1,'Null');
    let data = await this.firebaseService.getData("Pacas", idPaca);
    if (data) {
      let paca = new Paca(
        data['id'],
        data['tipo'],
        data['ubicacion'] || undefined,
        data['sede'] || undefined,
        data['estado'] || undefined,
        data['mantenimiento'] || undefined,
        data['historialCampo'] || undefined
      );
      return paca
    }

    return paca;
  }

  async pacasBuild(): Promise<Paca[]> {
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
      element.historialCampo.map((h: { fecha: string; pacaId: number, sede: string, ubicacion: string, distancia: number}) => new UbicacionCampo(
        h.distancia,
        h.ubicacion,
        h.sede,
        h.fecha,
        h.pacaId
      ))
    ));
    return pacas
  }

  withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Promise timed out'));
      }, ms);
  
      promise
        .then(value => {
          clearTimeout(timeoutId);
          resolve(value);
        })
        .catch(err => {
          clearTimeout(timeoutId);
          reject(err);
        });
    });
  }
}
