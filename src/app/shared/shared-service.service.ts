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

  async checkNewArcos(): Promise<boolean> {
    try {
      let data = await this.firebaseService.getData("meta", "updatecode");

      // Verificar si `data` no es `null` y tiene el atributo `updateArcos`
      if (data && data['updateArcos'] !== undefined) {
        let updateCode = data['updateArcos'];
        let arcoCode = sessionStorage.getItem('arcoCode');
        
        
        if (updateCode != arcoCode) {
          console.log(updateCode, arcoCode);
          sessionStorage.setItem('arcoCode', updateCode);
          // Asegurarse de que `arcoCode` no sea `null`
          return false;
        } else {
          return true;
        }
      }
  
      return false;
    } catch (error) {
      console.error("Error fetching data: ", error);
      return false;
    }
  }

  async checkNewPacas(): Promise<boolean> {
    try {
      let data = await this.firebaseService.getData("meta", "updatecode");

      // Verificar si `data` no es `null` y tiene el atributo `updateArcos`
      if (data && data['updatePacas'] !== undefined) {
        let updateCode = data['updatePacas'];
        let pacaCode = sessionStorage.getItem('pacaCode');
        
        
        if (updateCode != pacaCode) {
          console.log(updateCode, pacaCode);
          sessionStorage.setItem('pacaCode', updateCode);
          // Asegurarse de que `arcoCode` no sea `null`
          return false;
        } else {
          return true;
        }
      }
  
      return false;
    } catch (error) {
      console.error("Error fetching data: ", error);
      return false;
    }
  }
  
  async updateArcosCode() {
    const date = new Date().toISOString(); // Convertimos la fecha actual a una cadena ISO
    const encoder = new TextEncoder();
    const data = encoder.encode(date);

    // Generar el hash usando el API SubtleCrypto
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convertir el hash a una cadena hexadecimal
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    await this.firebaseService.updateFieldInDocument("meta", "updatecode","updateArcos",hashHex);
    console.log(hashHex);
    
  }

  async updatePacasCode() {
    const date = new Date().toISOString(); // Convertimos la fecha actual a una cadena ISO
    const encoder = new TextEncoder();
    const data = encoder.encode(date);

    // Generar el hash usando el API SubtleCrypto
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convertir el hash a una cadena hexadecimal
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    await this.firebaseService.updateFieldInDocument("meta", "updatecode","updatePacas",hashHex);
    console.log(hashHex);
    
  }
  

  getSedes() {
    return ['','Liceo Cervantes','Chia','Taller']
  }

  getDistancias() {
    return ['','0','5','10','18','30','50','60','70']
  }

  getUbicaciones() {
    return ['','Clase','Practica libre']
  }
}
