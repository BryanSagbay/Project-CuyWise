import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  isSidebarVisible = false; 
  currentPage: string = '';  
  isActive: boolean = true;  


  // Definir las rutas posibles como un tipo literal
  private breadcrumbMap: { [key in 'home' | 'imagenes' | 'animales' | 'mediciones' | 'logs' | 'diagramas']: string } = {
    'home': 'Inicio',
    'imagenes': 'Imágenes',
    'animales': 'Animales',
    'mediciones': 'Mediciones',
    'logs': 'Logs',
    'diagramas': 'Diagramas',
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  // Método para inicializar el componente 
  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateBreadcrumb(); 
    });

    this.updateBreadcrumb();
  }

  // Función que actualiza el breadcrumb según la ruta activa
  updateBreadcrumb(): void {
    let route = this.route.firstChild;

    if (route) {
      const path = route.snapshot.url[0]?.path || '';  // Tomamos el primer segmento de la ruta
      this.currentPage = this.getBreadcrumbName(path);  // Actualizamos el nombre de la página en el breadcrumb
    }
  }

  // Función que traduce la ruta en nombre legible para el breadcrumb
  getBreadcrumbName(path: string): string {
    return this.breadcrumbMap[path as keyof typeof this.breadcrumbMap] || path; // Si no hay traducción, devolvemos la ruta tal cual
  }

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
