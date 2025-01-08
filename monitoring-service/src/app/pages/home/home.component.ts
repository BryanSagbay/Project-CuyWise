import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  isSidebarVisible = false; // Por defecto, oculto en móviles.

  //Metodo para abrir 
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  // Método para cerrar el sidebar.
  closeSidebar() {
    this.isSidebarVisible = false;
  }
  
   // Detectar clics fuera del menú para cerrarlo.
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const sidebar = document.getElementById('sidenav-main');
    const target = event.target as HTMLElement;

    if (
      this.isSidebarVisible &&
      sidebar &&
      !sidebar.contains(target) &&
      !target.closest('.btn-light') 
    ) {
      this.isSidebarVisible = false;
    }
  }
}