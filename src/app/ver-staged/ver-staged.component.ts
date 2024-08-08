import { Attribute, Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { SharedServiceService } from '../shared/shared-service.service';
import { Paca } from '../model/paca';
import { PrestamoArco } from '../model/prestamoArco';
import { MatSnackBar } from '@angular/material/snack-bar';

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

interface PrestamoArcos {
  id: string;
  actualizado: string;
  autor: string;
  tipo: string;
  fecha: string;
  hora: string;
  sede: string;
  arcos: Arco[];
  expanded?: boolean;
}

interface Arco {
  id: number;
  expanded: boolean;
}


@Component({
  selector: 'app-ver-staged',
  templateUrl: './ver-staged.component.html',
  styleUrls: ['./ver-staged.component.css']
})
export class VerStagedComponent {
  //Popup
  actualizado: boolean = false;
  isPopupVisible: boolean = false;
  popupTitle: string = '';
  popupMessage: string = '';

  json: any;
  public cargado: boolean = false;
  public listaPacas: Paca[] = [];

  public sedes: SedeTmp[] = [];

  public prestamoArcosList: PrestamoArcos[] = []

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private sharedServiceService: SharedServiceService,
    private snackBar: MatSnackBar,
  ) {}

  async ngOnInit(): Promise<void> {
    let res = await this.sharedServiceService.getStaged();
    console.log(res);
    
    this.filtrarPorTipo(res)

    this.cargado = !this.cargado
  }

  filtrarPorTipo(res:any) {
    res.forEach((element: any) => {
      if (element.tipo === "Prestamo Arcos") {
        this.prestamoArcosList.push(element);  // Agrega el elemento a la lista
      }
    });
    console.log(this.prestamoArcosList);
  }

  togglePrestamo(prestamo: PrestamoArcos) {
    prestamo.expanded = !prestamo.expanded;
  }
  
  toggleArco(prestamo: PrestamoArcos, index: number) {
    const arco = prestamo.arcos[index];
    arco.expanded = !arco.expanded;
  }
  
  

  async enviarActualizacionesPrestamoArcos(hash: string): Promise<void> {
    if (confirm("¿Seguro que quiere aceptar este reporte? Si no está seguro de ello revise nuevamente los detalles")) {
      try {
        // Obtener los datos de Firebase usando el hash proporcionado
        const datos = await this.firebaseService.getData("toStage", hash);
    
        if (!datos) {
          console.log('No se encontraron datos para el hash proporcionado.');
          return;
        }
    
        // Suponiendo que los datos incluyen una lista de préstamos para ser actualizados
        datos['arcos'].forEach((prestamo: any) => {
          console.log(prestamo);
          let a:PrestamoArco = new PrestamoArco(datos['fecha'],datos['sede'],datos['hora'])
          console.log(a);
          const jsonString = JSON.stringify(a);
          let newObj = JSON.parse(jsonString);
          
          this.firebaseService.addToArrayInDocument("Arcos",prestamo['id'].toString(),"historial",newObj)
          this.firebaseService.addDocument("terminados", hash, datos)
          this.firebaseService.deleteDocumentFromCollection("toStage",hash)
          this.sharedServiceService.updateArcosCode()
          
        });
    
        this.actualizadoPopup()
        this.actualizado = true
      } catch (error) {
        console.error('Error al actualizar los préstamos:', error);
      }
    }
    
  }
  
  eliminarStage(hash: string) {
    if (confirm("¿Seguro que quiere eliminar este reporte?")) {
      this.firebaseService.deleteDocumentFromCollection("toStage",hash)
      location.reload();
    }
  }
  

  openSnackBar(message: string, action: string = 'Cerrar') {
    this.snackBar.open(message, action, {
      duration: 3000, // duración del snackbar en milisegundos
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  showPopup() {
    this.isPopupVisible = true
  }

  onPopupClose() {
    this.isPopupVisible = false;

    if (this.actualizado) {
      this.router.navigate(['/menu']);
    }
  }

  actualizadoPopup() {
    this.popupTitle = 'Información actualizada';
    this.popupMessage = 'Registros agregados respectivamente';
    this.showPopup()
  }
}
