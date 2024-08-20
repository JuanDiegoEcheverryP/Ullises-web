import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {SharedServiceService} from '../shared/shared-service.service'

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.css']
})
export class MenuPrincipalComponent {
  public isMenuOpen: boolean = false;
  public isSidebarCollapsed = true;
  public activeMenu: string | null = null;

  constructor(private router: Router,private SharedServiceService: SharedServiceService) { }

  toggleMenu(menu: string): void {
    if (this.activeMenu === menu) {
      this.activeMenu = null;
    } else {
      this.activeMenu = menu;
    }
  }
  
  navigateTo(url: string) {
    this.router.navigate([url]);
  }

  forceActualization() {
    this.SharedServiceService.borrarCodigosHash()
    let arcoCode = sessionStorage.getItem('arcoCode');
    console.log(arcoCode);
  }
}
