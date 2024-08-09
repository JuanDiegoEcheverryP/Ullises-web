import { Component } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import {SharedServiceService} from '../shared/shared-service.service'
import { ActivatedRoute, Router } from '@angular/router';
import { Arco } from '../model/arco';
import { MatSnackBar } from '@angular/material/snack-bar';

interface ArcoSelection {
  arco: Arco;
  seleccionada: boolean;
}

@Component({
  selector: 'app-prestamo-arco',
  templateUrl: './prestamo-arco.component.html',
  styleUrls: ['./prestamo-arco.component.css']
})
export class PrestamoArcoComponent {
  public code: string = '';
  
  //Popup
  actualizado: boolean = false;
  isPopupVisible: boolean = false;
  popupTitle: string = '';
  popupMessage: string = '';

  public cargado: boolean = false

  sedes = this.SharedServiceService.getSedes()
  distancias = this.SharedServiceService.getDistancias()
  ubicaciones = this.SharedServiceService.getUbicaciones()

  public listaArcos: Arco[] = [];
  public listaArcosSelection: ArcoSelection[] = [];

  constructor(private firebaseService: FirebaseService, 
    private router: Router,
    private SharedServiceService: SharedServiceService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute) {
  }

  async ngOnInit(): Promise<void> {
    
    this.listaArcos = await this.SharedServiceService.setSessionArcos();
    this.obtenerArcos()

    this.route.queryParams.subscribe(params => {
      this.code = params['code'];
    });
    if (this.code) {
      this.cargarConCodigo()
    }
  }

  async cargarConCodigo() {
    const fechaSeleccionada = document.getElementById('fecha') as HTMLInputElement;
    const inputSede = document.getElementById('sede') as HTMLInputElement;
    const inputTime = document.getElementById('time') as HTMLInputElement;

    const datos = await this.firebaseService.getData("toStage", this.code);
    console.log(datos);
    
    if (datos !== null) {
      fechaSeleccionada.value = datos['fecha'];
      inputSede.value = datos['sede'];
      inputTime.value = datos['hora'];
  
      console.log(datos['arcos']);  // Make sure this is the correct property name and it logs expected values
      
      datos['arcos'].forEach((element: any) => {
        this.listaArcosSelection.forEach(element2 => {
          if(element.id == element2.arco.id.toString()) {
            console.log(element.id);
            element2.seleccionada = true
            let checkbox = document.getElementById('checkbox-'+element.id) as HTMLInputElement;
            checkbox.checked = true;
          }
        });
        
        
      });
  } else {
    this.router.navigate(["/"])
  }
  
}


  async obtenerArcos() {
    this.listaArcos.sort((a, b) => a.id - b.id);
    this.cargado = true;
    this.listaArcosSelection = this.listaArcos.map(arco => ({ arco, seleccionada: false}));
  }

  toggleSeleccion(pacaSelection: ArcoSelection) {
    pacaSelection.seleccionada = !pacaSelection.seleccionada;
    console.log(this.listaArcosSelection);
  }

  async enviar() {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Bogota',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    
    const colombiaTime = now.toLocaleTimeString('en-US', options);

    const fechaSeleccionada = (document.getElementById('fecha') as HTMLInputElement).value;
    const inputSede = (document.getElementById('sede') as HTMLInputElement).value;
    const inputTime = (document.getElementById('time') as HTMLInputElement).value;
  
    if (fechaSeleccionada == "" ) {
      this.popupTitle = 'Información faltante';
      this.popupMessage = 'Seleccione la fecha';
      this.showPopup();
      return
    } else if (inputSede == "") {
      this.popupTitle = 'Información faltante';
      this.popupMessage = 'Seleccione la sede';
      this.showPopup();
      return
    }
    else if (inputTime == "") {
      this.popupTitle = 'Información faltante';
      this.popupMessage = 'Seleccione la hora';
      this.showPopup();
      return
    }
  
    let filtradas = this.listaArcosSelection.filter(arco => arco.seleccionada);
  
    if (filtradas.length == 0) {
      this.popupTitle = 'Información faltante';
      this.popupMessage = 'Seleccione los arcos del campo';
      this.showPopup();
      return
    }

    const plainArcos = filtradas.map(item => ({
      id: item.arco.id
    }));
  
    //console.log(plainArcos);

    if (this.code) {
      this.firebaseService.addDocument("toStage", await this.code, {"actualizado": colombiaTime,"Autor":"DB","tipo":"Prestamo Arcos","sede": inputSede,"fecha": fechaSeleccionada,"hora": inputTime,"arcos": plainArcos})
      .then(() => {
        this.SharedServiceService.updateArcosCode();
        this.actualizado = true;
        this.actualizadoPopup();
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      });
    }
    else {
      this.firebaseService.addDocument("toStage", await this.SharedServiceService.crearCodigoHash(), {"actualizado": colombiaTime,"Autor":"DB","tipo":"Prestamo Arcos","sede": inputSede,"fecha": fechaSeleccionada,"hora": inputTime,"arcos": plainArcos})
      .then(() => {
        this.SharedServiceService.updateArcosCode();
        this.actualizado = true;
        this.actualizadoPopup();
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      });
    }
  
    
  }

  addArco() {
    let numero = (document.getElementById('add-arco') as HTMLInputElement);
    let checkbox = document.getElementById('checkbox-'+numero.value) as HTMLInputElement;

    if (checkbox) {
      this.listaArcosSelection.forEach(element => {
        if (element.arco.id == Number.parseInt(numero.value)) {
          element.seleccionada = true
        }
      });
      checkbox.checked = true;
      this.openSnackBar("Arco agregado",'OK')
    } else {
      this.popupTitle = 'El arco no existe';
      this.popupMessage = 'Revisa bien el numero';
      this.showPopup();
    }
    numero.value = ''
  }

  openSnackBar(message: string, action: string = 'Cerrar') {
    this.snackBar.open(message, action, {
      duration: 1000, // duración del snackbar en milisegundos
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }
  

  showPopup() {
    this.isPopupVisible = true;
  }

  onPopupClose() {
    this.isPopupVisible = false;

    if (this.actualizado) {
      this.router.navigate(['/menu']);
    }
  }

  actualizadoPopup() {
    this.popupTitle = 'Información actualizada';
    this.popupMessage = 'Agregado al historial';
    this.showPopup()
  }
}
