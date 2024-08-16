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
import { ArmarCampoComponent } from './armar-campo/armar-campo.component';
import { VerHistorialesPacasSedeComponent } from './ver-historiales-pacas-sede/ver-historiales-pacas-sede.component';
import { MapToIterablePipe } from './map-to-iterable.pipe';
import { PrestamoArcoComponent } from './prestamo-arco/prestamo-arco.component';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { VerStagedComponent } from './ver-staged/ver-staged.component';
import { PromptComponent } from './components/prompt/prompt.component';
import { VerPrestamosArcosComponent } from './ver-prestamos-arcos/ver-prestamos-arcos.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';

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
    ArmarCampoComponent,
    VerHistorialesPacasSedeComponent,
    MapToIterablePipe,
    PrestamoArcoComponent,
    VerStagedComponent,
    PromptComponent,
    VerPrestamosArcosComponent,
    SideBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MatSnackBarModule
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
