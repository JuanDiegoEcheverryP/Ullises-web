import { Component } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { PrestamoArco } from '../model/prestamoArco';
import { Arco } from '../model/arco';
import { Mantenimiento } from '../model/mantenimiento';
import { Router } from '@angular/router';
import { Paca } from '../model/paca';
import { UbicacionCampo } from '../model/ubicacionCampo';
import {SharedServiceService} from '../shared/shared-service.service'

@Component({
  selector: 'app-crear-paca',
  templateUrl: './crear-paca.component.html',
  styleUrls: ['./crear-paca.component.css']
})
export class CrearPacaComponent {
  json: any;
  
  //Popup
  actualizado: boolean = false;
  isPopupVisible: boolean = false;
  popupTitle: string = '';
  popupMessage: string = '';

  //Opciones
  public historialCampo: UbicacionCampo[] = []
  public mantenimiento: Mantenimiento[] = [];


  public distancia: number[] = [];
  public estadoPacas: string[] = [];
  public tipoPacas: string[] = [];
  public ubicacionPacas: string[] = [];
  public sedes: string[] = [];

  constructor(private firebaseService: FirebaseService, private router: Router, private SharedServiceService: SharedServiceService) {
    // Inicializa Firebase cuando se crea este componente
  }
  
  ngOnInit(): void {
    this.firebaseService.getData('Values', 'Pacas')
      .then(data => {
        console.log("Document data from component:", data);
        this.json = data;
        
        if(this.json) {
          this.json.Distancia.forEach((element: any) => {
            this.distancia.push(element)
          });
          this.json.Estado.forEach((element: any) => {
            this.estadoPacas.push(element)
          });
          this.json.Tamaño.forEach((element: any) => {
            this.tipoPacas.push(element)
          });
          this.json.Ubicacion.forEach((element: any) => {
            this.ubicacionPacas.push(element)
          });
        }
        else {
          alert("Error de base de datos")
        }
        

      })
      .catch(error => {
        console.error("Error getting document from component: ", error);
      });
    this.firebaseService.getAllDataFromCollection('Sedes')
    .then(data => {
      this.json = data;
      if(this.json) {
        this.json.forEach((element: any) => {
          this.sedes.push(element.id)
        });
      }
      else {
        alert("Error de base de datos")
      }
    })
  }

  async agregarRegistro(): Promise<void> {
    const numero = Number((document.getElementById('numero') as HTMLSelectElement).value);
    const tipoPaca = (document.getElementById('tipo') as HTMLSelectElement).value;
    const ubicacion = (document.getElementById('ubicacion') as HTMLSelectElement).value;
    const estado = (document.getElementById('estado') as HTMLSelectElement).value;
    const sede = (document.getElementById('sede') as HTMLSelectElement).value;
    
    let newPaca = new Paca(numero,tipoPaca,ubicacion,sede,estado,this.mantenimiento,this.historialCampo)

    const jsonString = JSON.stringify(newPaca);

    //Validacion
    if(numero != 0){
      let a = await this.firebaseService.getData("Pacas",newPaca.id.toString());
      if (a == null) {
        let newObj = JSON.parse(jsonString);
        this.firebaseService.addDocument("Pacas",newPaca.id.toString(),newObj)
        this.SharedServiceService.updatePacasCode()

        this.actualizado = true
        this.actualizadoPopup()
      }
      else {
        alert("Paca ya existe")
      }
    }
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
    this.popupTitle = 'Registro completado';
    this.popupMessage = 'Paca añadida';
    this.showPopup()
  }
}
