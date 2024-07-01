import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'; // Importa el módulo de enrutamiento
import { FirebaseService } from './services/firebase.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule // Asegúrate de que el módulo de enrutamiento esté importado aquí
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
