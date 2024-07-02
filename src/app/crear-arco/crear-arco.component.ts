import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-crear-arco',
  templateUrl: './crear-arco.component.html',
  styleUrls: ['./crear-arco.component.css']
})
export class CrearArcoComponent implements OnInit {
  json: any;
  public calidadArcos: string[] = [];
  public estadoArcos: string[] = [];
  public librajeArcos: number[] = [];
  public manoArcos: string[] = [];
  public tipoArcos: string[] = [];

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
}



//console.log(this.firebaseService.getData("Values","Arcos"));