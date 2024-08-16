import { Component } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { SharedServiceService } from '../shared/shared-service.service';
import { Arco } from '../model/arco';
import { MatSnackBar } from '@angular/material/snack-bar';

interface ArcoTMP {
  idPaca: number;
  hora: string;
}

interface Fecha {
  fecha: string;
  pacas: ArcoTMP[];
  expanded: boolean;
}

interface SedeTmp {
  nombre: string;
  fechas?: Fecha[] | undefined;
  expanded: boolean;
}

@Component({
  selector: 'app-ver-prestamos-arcos',
  templateUrl: './ver-prestamos-arcos.component.html',
  styleUrls: ['./ver-prestamos-arcos.component.css']
})
export class VerPrestamosArcosComponent {

  json: any;
  public cargado: boolean = false;
  public listaArcos: Arco[] = [];

  public sedes: SedeTmp[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private sharedServiceService: SharedServiceService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit(): Promise<void> {
    if (await this.sharedServiceService.checkNewArcos()) {
      const arcosString = sessionStorage.getItem('arcos');
      console.log(arcosString);
      
      
      if (arcosString) {
        this.listaArcos = JSON.parse(arcosString) as Arco[];
      } else {
        this.listaArcos = await this.sharedServiceService.withTimeout(this.sharedServiceService.arcosBuild(), 5000);
        sessionStorage.setItem('arcos', JSON.stringify(this.listaArcos));
      }
    } else {
      this.listaArcos = await this.sharedServiceService.withTimeout(this.sharedServiceService.arcosBuild(), 5000);
      sessionStorage.setItem('arcos', JSON.stringify(this.listaArcos));
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
    this.listaArcos.forEach(arco => {
      arco.historial?.forEach(historial => {
        this.sedes.forEach(element => {
          if (element.nombre == historial.sede) {
            let existe = false;
            element.fechas?.forEach(element2 => {
              if (element2.fecha == historial.fecha) {
                existe = true;
                let r: ArcoTMP = {
                  idPaca: arco.id,
                  hora: historial.hora
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
              let r: ArcoTMP = {
                idPaca: arco.id,
                hora: historial.hora
              };
              a.pacas.push(r);
              element.fechas?.push(a);
            }
          }
        });
      });
    });
  
    // Ordenar los arcos por hora y secundario por id
    this.sedes.forEach(sede => {
      sede.fechas?.forEach(fecha => {
        fecha.pacas.sort((a, b) => {
          // Ordenar por hora
          if (a.hora !== b.hora) {
            return a.hora.localeCompare(b.hora);
          }
          // Si las horas son iguales, ordenar por idPaca
          return a.idPaca - b.idPaca;
        });
      });
    });
  
    this.cargado = true;
    console.log(this.sedes);
  }

  eliminarArco(_t34: ArcoTMP) {
    throw new Error('Method not implemented.');
  }

  editarArco(_t34: ArcoTMP) {
    throw new Error('Method not implemented.');
  }
  

  toggleSede(sede: SedeTmp) {
    sede.expanded = !sede.expanded;
  }

  toggleFecha(fecha: Fecha) {
    console.log(2);
    
    fecha.expanded = !fecha.expanded;
  }

  openSnackBar(message: string, action: string = 'Cerrar') {
    this.snackBar.open(message, action, {
      duration: 3000, // duración del snackbar en milisegundos
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
