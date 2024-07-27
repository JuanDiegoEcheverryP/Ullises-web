import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'; // Importa el módulo de enrutamiento
import { FirebaseService } from './services/firebase.service';
import { CrearPacaComponent } from './crear-paca/crear-paca.component';
import { InicioComponent } from './inicio/inicio.component';
import { TestComponent } from './test/test.component';
import { CrearArcoComponent } from './crear-arco/crear-arco.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VerArcosComponent } from './ver-arcos/ver-arcos.component';
import { VerPacasComponent } from './ver-pacas/ver-pacas.component';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { ArquitecturaComponent } from './arquitectura/arquitectura.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EditarArcoComponent } from './editar-arco/editar-arco.component';
import { AlertComponent } from './components/alert/alert.component';
import { AddHistorialPacaComponent } from './add-historial-paca/add-historial-paca.component';

@NgModule({
  declarations: [
    AppComponent,
    CrearPacaComponent,
    InicioComponent,
    TestComponent,
    CrearArcoComponent,
    VerArcosComponent,
    VerPacasComponent,
    MenuPrincipalComponent,
    ArquitecturaComponent,
    NavbarComponent,
    EditarArcoComponent,
    AlertComponent,
    AddHistorialPacaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule // Asegúrate de que el módulo de enrutamiento esté importado aquí
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
