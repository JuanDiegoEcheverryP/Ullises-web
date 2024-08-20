import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CrearPacaComponent } from './crear-paca/crear-paca.component';
import { InicioComponent } from './inicio/inicio.component';
import { TestComponent } from './test/test.component';
import { CrearArcoComponent } from './crear-arco/crear-arco.component';
import { VerArcosComponent } from './ver-arcos/ver-arcos.component';
import { VerPacasComponent } from './ver-pacas/ver-pacas.component';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { ArquitecturaComponent } from './arquitectura/arquitectura.component';
import { EditarArcoComponent } from './editar-arco/editar-arco.component';
import { AddHistorialPacaComponent } from './add-historial-paca/add-historial-paca.component';
import { ArmarCampoComponent } from './armar-campo/armar-campo.component';
import { VerHistorialesPacasSedeComponent } from './ver-historiales-pacas-sede/ver-historiales-pacas-sede.component';
import { PrestamoArco } from './model/prestamoArco';
import { PrestamoArcoComponent } from './prestamo-arco/prestamo-arco.component';
import { VerStagedComponent } from './ver-staged/ver-staged.component';
import { VerPrestamosArcosComponent } from './ver-prestamos-arcos/ver-prestamos-arcos.component';
import { MantenimientoArcoComponent } from './mantenimiento-arco/mantenimiento-arco.component';
import { MantenimientoPacaComponent } from './mantenimiento-paca/mantenimiento-paca.component';

const routes: Routes = [
  { path: 'test', component: TestComponent },
  { path: 'crearPaca', component: CrearPacaComponent },
  { path: 'crearArco', component: CrearArcoComponent },
  { path: 'verArcos', component: VerArcosComponent },
  { path: 'verPacas', component: VerPacasComponent },
  { path: 'editar-arco', component: EditarArcoComponent },
  { path: 'menu', component: MenuPrincipalComponent },
  { path: 'arquitectura', component: ArquitecturaComponent },
  { path: 'add-historial-paca', component: AddHistorialPacaComponent },
  { path: 'armarCampo', component: ArmarCampoComponent },
  { path: 'ver-historial-pacas-sede', component: VerHistorialesPacasSedeComponent },
  { path: 'prestamo-Arco', component: PrestamoArcoComponent },
  { path: 'ver-staged', component: VerStagedComponent },
  { path: 'ver-historial-arcos', component: VerPrestamosArcosComponent },
  { path: 'mantenimiento-arco', component: MantenimientoArcoComponent },
  { path: 'mantenimiento-paca', component: MantenimientoPacaComponent },
  { path: '**', component: MenuPrincipalComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
