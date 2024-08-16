import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {
  public isMenuOpen: boolean = false;
  public isSidebarCollapsed = false;
  public activeMenu: string | null = null;

  constructor(private router: Router) { }

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
}
