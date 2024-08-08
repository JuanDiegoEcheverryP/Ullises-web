import { Component } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Arco } from '../model/arco';
import { Mantenimiento } from '../model/mantenimiento';
import { PrestamoArco } from '../model/prestamoArco';
import { ActivatedRoute, Router } from '@angular/router';
import {SharedServiceService} from '../shared/shared-service.service'
import { find } from 'rxjs';

@Component({
  selector: 'app-ver-arcos',
  templateUrl: './ver-arcos.component.html',
  styleUrls: ['./ver-arcos.component.css']
})
export class VerArcosComponent {

  public cargado: boolean = false
  public filtro: boolean = false

  public listaArcos: Arco[] = [];
  public listaArcosStaged: Arco[] = [];
  showMantenimiento: boolean[] = [];
  showHistorial: boolean[] = [];

  filtroCalidad = ['','Buena','Dañado'];
  filtroEstado= ['','Armado','Desarmado','En uso'];
  filtroLibraje = ['','0','48','62','64','66','68','70']
  filtroMano = ['','Izquieda', 'Derecha', 'Ambos']
  filtroTipo = ['','Recurvo','Compuesto','Niño']

  public tipo = '2'


  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private SharedServiceService: SharedServiceService) {
    
  }

  async ngOnInit(): Promise<void> {
    if (await this.SharedServiceService.checkNewArcos()) {
      const arcosString = sessionStorage.getItem('arcos');
      if (arcosString) {
        this.listaArcos = JSON.parse(arcosString) as Arco[];
      } else {
        this.listaArcos = await this.SharedServiceService.withTimeout(this.SharedServiceService.arcosBuild(), 5000); // 5 seconds timeout
        sessionStorage.setItem('arcos', JSON.stringify(this.listaArcos));
      }
    } else {
      this.listaArcos = await this.SharedServiceService.withTimeout(this.SharedServiceService.arcosBuild(), 5000); // 5 seconds timeout
      sessionStorage.setItem('arcos', JSON.stringify(this.listaArcos));
    }
    this.obtenerArcos()
    
    this.showMantenimiento = new Array(this.listaArcos.length).fill(false);
    this.showHistorial = new Array(this.listaArcos.length).fill(false);
  }

  obtenerArcos() {
    this.listaArcos.sort((a, b) => a.id - b.id);
    this.cargado = true;
    this.findAll()
  }

  toggleSection(index: number, section: string): void {
    if (section === 'mantenimiento') {
      this.showMantenimiento[index] = !this.showMantenimiento[index];
    } else if (section === 'historial') {
      this.showHistorial[index] = !this.showHistorial[index];
    }
  }

  editarArco(id:number) {
    sessionStorage.setItem('arcoId', id.toString());
    this.router.navigate([`editar-arco`]);
  }

  cleanAll() {
    this.listaArcosStaged = []
  }

  findAll() {
    this.listaArcosStaged = this.listaArcos
  }

  filtrarArcos() {
    const tipoArco = (document.getElementById('tipo') as HTMLSelectElement).value;
    const calidadArco = (document.getElementById('calidad') as HTMLSelectElement).value;
    const estadoArco = (document.getElementById('estado') as HTMLSelectElement).value;
    const librajeArco = (document.getElementById('libraje') as HTMLSelectElement).value;
    const manoArco = (document.getElementById('mano') as HTMLSelectElement).value;
    this.cleanAll()
    this.listaArcos.forEach(element => {
      if ((element.tipo == tipoArco || tipoArco == '') &&
      (element.calidad == calidadArco || calidadArco == '') &&
      (element.estado == estadoArco || estadoArco == '') &&
      (element.libraje?.toString() == librajeArco || librajeArco == '') &&
      (element.mano == manoArco || manoArco == '') 
      
      ) {
        this.listaArcosStaged.push(element)
      }
    });
    
  }
  
  toggleFilter() {
      if (this.filtro) {
        this.filtro = false
      }
      else {
        this.filtro = true
      }
  }
}
