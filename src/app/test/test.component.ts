import { Component } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  title = 'my-app';
  paca: any;
  allPacasData: any;

  constructor(private firebaseService: FirebaseService) {
    // Inicializa Firebase cuando se crea este componente
  }

  addFirestoreEntry() {
    const data = {
      "id": "Paca 1",
      "Numero": 1,
      "Historial campo": [
        {
          "Distancia": 5,
          "Ubicacion": "Primera clase",
          "Fecha": {
            "seconds": 1719757235,
            "nanoseconds": 119000000
          },
          "Sede": "Liceo Cervantes"
        },
        {
          "Ubicacion": "Modulos",
          "Distancia": 10,
          "Fecha": {
            "seconds": 1719843713,
            "nanoseconds": 576000000
          },
          "Sede": "Liceo Cervantes"
        }
      ],
      "Tipo paca": "Grande",
      "Historial mantenimiento": [
        {
          "Concepto": "Hueco agujereado",
          "Responsable": "Julian",
          "Fecha": {
            "seconds": 1719118800,
            "nanoseconds": 136000000
          }
        },
        {
          "Fecha": {
            "seconds": 1719723600,
            "nanoseconds": 271000000
          },
          "Responsable": "Julian",
          "Concepto": "aaaa"
        }
      ],
      "Estado actual": "Dañado",
      "Ubicacion actual": "Guardado",
      "Sede actual": "Liceo Cervantes"
    };
    this.firebaseService.addDocument("Pacas","Paca 1",data)
  }

  async fetchFirestoreData() {
    this.paca = await this.firebaseService.getData("Pacas","Paca 1");
  }

  async deleteFirestoreData() {
    await this.firebaseService.deleteDocumentFromCollection("Pacas","Paca 1");
    this.paca = null; // Limpia los datos locales después de borrar
  }

  async downloadAllData() {
    this.allPacasData = await this.firebaseService.getAllDataFromCollection("Pacas");
    this.downloadFile(this.allPacasData);
  }

  downloadFile(data: any[]) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pacas-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
