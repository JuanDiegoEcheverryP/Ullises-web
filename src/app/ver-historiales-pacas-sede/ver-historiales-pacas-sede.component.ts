// ver-historiales-pacas-sede.component.ts
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { SharedServiceService } from '../shared/shared-service.service';
import { Paca } from '../model/paca';

interface PacaTMP {
  idPaca: number;
  distancia: number;
  ubicacion: string;
}

interface Fecha {
  fecha: string; // Puedes usar `string` si prefieres
  pacas: PacaTMP[];
  expanded: boolean;
}


interface SedeTmp {
  nombre: string;
  fechas?: Fecha[] | undefined;
  expanded: boolean;
}

@Component({
  selector: 'app-ver-historiales-pacas-sede',
  templateUrl: './ver-historiales-pacas-sede.component.html',
  styleUrls: ['./ver-historiales-pacas-sede.component.css']
})
export class VerHistorialesPacasSedeComponent implements OnInit {
  json: any;
  public cargado: boolean = false;
  public listaPacas: Paca[] = [];

  public sedes: SedeTmp[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private sharedServiceService: SharedServiceService
  ) {}

  async ngOnInit(): Promise<void> {
    if (await this.sharedServiceService.checkNewPacas()) {
      const pacasString = sessionStorage.getItem('pacas');
      if (pacasString) {
        this.listaPacas = JSON.parse(pacasString) as Paca[];
      } else {
        this.listaPacas = await this.sharedServiceService.withTimeout(this.sharedServiceService.pacasBuild(), 5000);
        sessionStorage.setItem('pacas', JSON.stringify(this.listaPacas));
      }
    } else {
      this.listaPacas = await this.sharedServiceService.withTimeout(this.sharedServiceService.pacasBuild(), 5000);
      sessionStorage.setItem('pacas', JSON.stringify(this.listaPacas));
    }

    this.firebaseService.getAllDataFromCollection('Sedes')
    .then(data => {
      this.json = data;
      if (this.json) {
        this.json.forEach((element: any) => {
          console.log(element);
          let a: SedeTmp = {
            nombre: element.id,fechas: [],expanded: false
          }
          this.sedes.push(a)
        });
        this.agrupar();
      } else {
        alert("Error de base de datos");
      }
    });


    this.agrupar();

  }

  agrupar() {
  this.listaPacas.forEach(paca => {
    paca.historialCampo?.forEach(historial => {
      this.sedes.forEach(element => {
        if (element.nombre == historial.sede) {
          let existe = false;
          element.fechas?.forEach(element2 => {
            if (element2.fecha == historial.fecha) {
              existe = true;
              let r: PacaTMP = {
                idPaca: paca.id,
                distancia: historial.distancia,
                ubicacion: historial.ubicacion
              };
              element2.pacas.push(r);
            }
          });

          if (!existe) {
            let a: Fecha = {
              fecha: historial.fecha,
              pacas: [],
              expanded: false
            };
            let r: PacaTMP = {
              idPaca: paca.id,
              distancia: historial.distancia,
              ubicacion: historial.ubicacion
            };
            a.pacas.push(r);
            element.fechas?.push(a);
          }
        }
      });
    });
  });

  // Ordenar las pacas en cada fecha por idPaca
  this.sedes.forEach(sede => {
    sede.fechas?.forEach(fecha => {
      fecha.pacas.sort((a, b) => a.idPaca - b.idPaca);
    });
  });

  this.cargado = true; // Establecer cargado después de procesar los datos
  console.log(this.sedes);
}

  
  // En tu clase VerHistorialesPacasSedeComponent

toggleSede(sede: SedeTmp) {
  sede.expanded = !sede.expanded; // Alterna la propiedad expanded
}

toggleFecha(fecha: Fecha) {
  console.log(2);
  
  fecha.expanded = !fecha.expanded; // Alterna la propiedad expanded
}

  
  
}
