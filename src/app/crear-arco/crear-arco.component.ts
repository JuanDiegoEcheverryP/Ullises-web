import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { PrestamoArco } from '../model/prestamoArco';
import { Arco } from '../model/arco';
import { Mantenimiento } from '../model/mantenimiento';


@Component({
  selector: 'app-crear-arco',
  templateUrl: './crear-arco.component.html',
  styleUrls: ['./crear-arco.component.css']
})
export class CrearArcoComponent implements OnInit {
  json: any;
  
  

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

  constructor(private firebaseService: FirebaseService) {
    // Inicializa Firebase cuando se crea este componente
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
          alert("Error de basef de datos")
        }
        

      })
      .catch(error => {
        console.error("Error getting document from component: ", error);
      });
  }

  async agregarRegistro(): Promise<void> {
    const numero = Number((document.getElementById('numero') as HTMLSelectElement).value);
    const tipoArco = (document.getElementById('tipo') as HTMLSelectElement).value;
    const libraje = Number((document.getElementById('libraje') as HTMLSelectElement).value);
    const mano = (document.getElementById('mano') as HTMLSelectElement).value;
    const calidad = (document.getElementById('calidad') as HTMLSelectElement).value;
    const estado = (document.getElementById('estado') as HTMLSelectElement).value;

    //meter a model
    let newArco = new Arco(numero,calidad,estado,libraje,tipoArco,mano,this.mantenimiento,this.historial)

    const jsonString = JSON.stringify(newArco);

    //Validacion
    if(numero != 0){
      let a = await this.firebaseService.getData("Arcos",newArco.id.toString());
      if (a == null) {
        let newObj = JSON.parse(jsonString);
        this.firebaseService.addDocument("Arcos",newArco.id.toString(),newObj)
      }
      else {
        console.log("Registro ya existe");
        
      }
    }
  }

  eliminarRegistro(index: number) {
    //this.registros.splice(index, 1);
  }
}



//console.log(this.firebaseService.getData("Values","Arcos"));