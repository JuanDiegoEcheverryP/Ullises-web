import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { Arco } from '../model/arco';
import {SharedServiceService} from '../shared/shared-service.service'
import { Mantenimiento } from '../model/mantenimiento';
import { PrestamoArco } from '../model/prestamoArco';

interface ArcoData {
  nombre: string;
  // Agrega otros atributos aquí según sea necesario
}

@Component({
  selector: 'app-editar-arco',
  templateUrl: './editar-arco.component.html',
  styleUrls: ['./editar-arco.component.css']
})
export class EditarArcoComponent implements OnInit {

  //Popup
  actualizado: boolean = false;
  isPopupVisible: boolean = false;
  popupTitle: string = '';
  popupMessage: string = '';

  public cargado: boolean = false

  //Opciones
  public calidadArcos: string[] = [];
  public estadoArcos: string[] = [];
  public librajeArcos: number[] = [];
  public manoArcos: string[] = [];
  public tipoArcos: string[] = [];

  public fecha: string | undefined;
  public sedeId: number | undefined;
  public arqueroId: number | undefined;
  public historial: PrestamoArco[] = [];

  public fecha1: number | undefined;
  public empleadoId: number | undefined;
  public concepto: string | undefined;
  public mantenimiento: Mantenimiento[] = [];

  //Registros
  itemName: string = '';
  items: string[] = [];
  json: any;

  public arco: Arco = new Arco(-1); // Inicializa la propiedad arco

  constructor(private firebaseService: FirebaseService, 
    private router: Router, 
    private SharedServiceService: SharedServiceService) {
    // Inicializa Firebase cuando se crea este componente
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

  ngOnInit(): void {
    
    this.firebaseService.getData('Values', 'Arcos')
      .then(data => {
        console.log("Document data from component:", data);
        this.json = data;
        
        if(this.json) {
          this.json.Calidad.forEach((element: any) => {
            this.calidadArcos.push(element)
          });
  
          this.json.Estado.forEach((element: any) => {
            this.estadoArcos.push(element)
          });
  
          this.json.Libraje.forEach((element: any) => {
            this.librajeArcos.push(element)
          });
  
          this.json.Mano.forEach((element: any) => {
            this.manoArcos.push(element)
          });
  
          this.json.Tipo.forEach((element: any) => {
            this.tipoArcos.push(element)
          });
        }
        else {
          alert("Error de base de datos")
        }
        
        this.fetchFirestoreData();
        this.cargado = true
      })
      .catch(error => {
        console.error("Error getting document from component: ", error);
      });
  }

  async fetchFirestoreData() {
    try {
      let arcoId = sessionStorage.getItem('arcoId');
  
      if (arcoId) {
        let r = JSON.parse(arcoId);
  
        // Asigna el nuevo valor a this.arco usando el resultado de arcoBuild
        try {
          this.arco = await this.withTimeout(this.SharedServiceService.arcoBuild(r.toString()), 5000); // 5 seconds timeout
          
          // Verificar si this.arco tiene un valor válido
          if (this.arco) {
            this.fillForm()
          } else {
            console.log("No se recibió ningún resultado.");
          }
        } catch (error) {
            console.error("Error al recibir el resultado:", error);
        }
      } else {
        console.error('arcoId no se encuentra en sessionStorage.');
      }
    } catch (error) {
      console.error('Error al obtener datos de Firestore:', error);
    }
  }
  
  
  // Helper method to add a timeout
  private withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
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
  
  async agregarRegistro(): Promise<void> {
    const numero = Number((document.getElementById('numero') as HTMLSelectElement).value);
    const tipoArco = (document.getElementById('tipo') as HTMLSelectElement).value;
    const libraje = Number((document.getElementById('libraje') as HTMLSelectElement).value);
    const mano = (document.getElementById('mano') as HTMLSelectElement).value;
    const calidad = (document.getElementById('calidad') as HTMLSelectElement).value;
    const estado = (document.getElementById('estado') as HTMLSelectElement).value;

    const cuerda = (document.getElementById('cuerda') as HTMLSelectElement).value;
    const rest = (document.getElementById('rest') as HTMLSelectElement).value;
    const palas = (document.getElementById('palas') as HTMLSelectElement).value;
    const pintura = (document.getElementById('pintura') as HTMLSelectElement).value;

    //meter a model
    let newArco = new Arco(numero,calidad,estado,libraje,tipoArco,mano,cuerda,rest,palas,pintura,this.mantenimiento,this.historial)

    const jsonString = JSON.stringify(newArco);

    //Validacion
    if(numero != 0){
      //let a = await this.firebaseService.getData("Arcos",newArco.id.toString());

      this.SharedServiceService.updateArcosCode()
      let newObj = JSON.parse(jsonString);
      this.firebaseService.addDocument("Arcos",newArco.id.toString(),newObj)

      this.actualizadoPopup()
      this.actualizado = true
    }
  }

  fillForm() {
    const inputNumero = document.getElementById('numero') as HTMLInputElement;
    const inputTipo = document.getElementById('tipo') as HTMLInputElement;
    const inputLibraje = document.getElementById('libraje') as HTMLInputElement;
    const inputMano = document.getElementById('mano') as HTMLInputElement;
    const inputCalidad = document.getElementById('calidad') as HTMLInputElement;
    const inputEstado = document.getElementById('estado') as HTMLInputElement;

    const inputCuerda = document.getElementById('cuerda') as HTMLInputElement;
    const inputRest = document.getElementById('rest') as HTMLInputElement;
    const inputPalas = document.getElementById('palas') as HTMLInputElement;
    const inputPintura = document.getElementById('pintura') as HTMLInputElement;
    
    inputNumero.value = this.arco.id.toString();

    if (this.arco.tipo !== undefined) {
      inputTipo.value = this.arco.tipo.toString();
    } else {
      inputTipo.value = "Vacio"
    }

    if (this.arco.libraje !== undefined) {
      inputLibraje.value = this.arco.libraje.toString();
    } else {
      inputLibraje.value = "Vacio"
    }

    if (this.arco.mano !== undefined) {
      inputMano.value = this.arco.mano.toString();
    } else {
      inputMano.value = "Vacio"
    }

    if (this.arco.calidad !== undefined) {
      inputCalidad.value = this.arco.calidad.toString();
    } else {
      inputCalidad.value = "Vacio"
    }

    if (this.arco.estado !== undefined) {
      inputEstado.value = this.arco.estado.toString();
    } else {
      inputEstado.value = "Vacio"
    }

    if (this.arco.estadoCuerda !== undefined) {
      inputCuerda.value = this.arco.estadoCuerda.toString();
    } else {
      inputCuerda.value = "Vacio"
    }

    if (this.arco.estadoRest !== undefined) {
      inputRest.value = this.arco.estadoRest.toString();
    } else {
      inputRest.value = "Vacio"
    }

    if (this.arco.estadoPalas !== undefined) {
      inputPalas.value = this.arco.estadoPalas.toString();
    } else {
      inputPalas.value = "Vacio"
    }

    if (this.arco.estadoPintura !== undefined) {
      inputPintura.value = this.arco.estadoPintura.toString();
    } else {
      inputPintura.value = "Vacio"
    }
  }

  actualizadoPopup() {
    this.popupTitle = 'Información actualizada';
    this.popupMessage = 'Arco actualizado';
    this.showPopup()
  }
  
}


