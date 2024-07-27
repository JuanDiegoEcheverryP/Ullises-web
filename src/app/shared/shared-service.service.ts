import { Injectable } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Arco } from '../model/arco';
import { Mantenimiento } from '../model/mantenimiento';
import { PrestamoArco } from '../model/prestamoArco';

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
