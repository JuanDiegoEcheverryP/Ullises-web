import { Component } from '@angular/core';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';

  constructor(private firebaseService: FirebaseService) {
    // Inicializa Firebase cuando se crea este componente
  }

  addFirestoreEntry() {
    this.firebaseService.addDataToPaca2()
  }
}
