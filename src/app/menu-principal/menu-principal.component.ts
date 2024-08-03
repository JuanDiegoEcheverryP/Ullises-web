import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {SharedServiceService} from '../shared/shared-service.service'

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.css']
})
export class MenuPrincipalComponent {


  constructor(private router: Router,private SharedServiceService: SharedServiceService) { }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }

  forceActualization() {
    this.SharedServiceService.borrarCodigosHash()
    let arcoCode = sessionStorage.getItem('arcoCode');
    console.log(arcoCode);
    
  }
}
