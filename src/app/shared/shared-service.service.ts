import { Injectable } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Arco } from '../model/arco';
import { Mantenimiento } from '../model/mantenimiento';
import { PrestamoArco } from '../model/prestamoArco';
import { Paca } from '../model/paca';
import { UbicacionCampo } from '../model/ubicacionCampo';
import { elementAt } from 'rxjs';

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
      element.historial.map((h: { fecha: string; sedeId: string; hora:string }) => new PrestamoArco(
        h.fecha, 
        h.sedeId,
        h.hora
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
    let tmp = this.firebaseService.getAllDataFromCollection("Sedes");
    let retorno = ['']
    tmp.then((data) => {
        data.map((element: any) => {
            retorno.push(element.id)
        });
    }).catch((error) => {
        console.error("Error fetching data: ", error);
    });

    return retorno;
}


  getDistancias() {
    let tmp = this.firebaseService.getData("Values", "Pacas");
    let retorno = ['']

    tmp.then((data) => {
        // Asume que 'data' es un objeto y que quieres acceder a un atributo específico, por ejemplo, 'nombre'.
        if (data && data['Distancia']) {
            data['Distancia'].forEach((element: string) => {
              retorno.push(element)
            });
        } else {
            console.log("El atributo 'nombre' no existe en los datos recibidos");
        }
    }).catch((error) => {
        console.error("Error fetching data: ", error);
    });
    
    return retorno
  }

  getUbicaciones() {
    let tmp = this.firebaseService.getData("Values", "Pacas");
    let retorno = ['']

    tmp.then((data) => {
        // Asume que 'data' es un objeto y que quieres acceder a un atributo específico, por ejemplo, 'nombre'.
        if (data && data['Ubicacion']) {
            data['Ubicacion'].forEach((element: string) => {
              retorno.push(element)
            });
        } else {
            console.log("El atributo 'nombre' no existe en los datos recibidos");
        }
    }).catch((error) => {
        console.error("Error fetching data: ", error);
    });
    
    return retorno
  }

  async getStaged(): Promise<any> {
    return await this.firebaseService.getAllDataFromCollection("toStage")
  }

  borrarCodigosHash() {
    sessionStorage.setItem('arcoCode', '');
    sessionStorage.setItem('pacaCode', '');
  }

  async setSessionArcos(): Promise<Arco[]> {
    let listaArcos:Arco[] = []
    if (await this.checkNewArcos()) {
      const arcosString = sessionStorage.getItem('arcos');
      if (arcosString) {
        listaArcos = JSON.parse(arcosString) as Arco[];
      } else {
        listaArcos = await this.withTimeout(this.arcosBuild(), 5000); // 5 seconds timeout
        sessionStorage.setItem('arcos', JSON.stringify(listaArcos));
      }
    } else {
      listaArcos = await this.withTimeout(this.arcosBuild(), 5000); // 5 seconds timeout
      sessionStorage.setItem('arcos', JSON.stringify(listaArcos));
    }
    return listaArcos
  }

  async setSessionPacas(): Promise<Paca[]> {
    let listaPacas:Paca[] = []
    if (await this.checkNewPacas()) {
      const pacasString = sessionStorage.getItem('pacas');
      if (pacasString) {
        listaPacas = JSON.parse(pacasString) as Paca[];
      } else {
        listaPacas = await this.withTimeout(this.pacasBuild(), 5000);
        sessionStorage.setItem('pacas', JSON.stringify(listaPacas));
      }
    } else {
      listaPacas = await this.withTimeout(this.pacasBuild(), 5000);
      sessionStorage.setItem('pacas', JSON.stringify(listaPacas));
    }
    return listaPacas
  }

  async crearCodigoHash() {
    const date = new Date().toISOString(); // Convertimos la fecha actual a una cadena ISO
    const encoder = new TextEncoder();
    const data = encoder.encode(date);

    // Generar el hash usando el API SubtleCrypto
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convertir el hash a una cadena hexadecimal
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex
  }
}
