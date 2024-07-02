import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'; // Importa el módulo de enrutamiento
import { FirebaseService } from './services/firebase.service';
import { CrearPacaComponent } from './crear-paca/crear-paca.component';
import { InicioComponent } from './inicio/inicio.component';
import { TestComponent } from './test/test.component';
import { CrearArcoComponent } from './crear-arco/crear-arco.component';

@NgModule({
  declarations: [
    AppComponent,
    CrearPacaComponent,
    InicioComponent,
    TestComponent,
    CrearArcoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule // Asegúrate de que el módulo de enrutamiento esté importado aquí
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
