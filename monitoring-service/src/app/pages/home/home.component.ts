import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';  // Importa FormsModule

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  isSidebarVisible = false; 
  currentPage: string = '';  
  isActive: boolean = true;  
  searchQuery: string = '';  
  searchResults: any[] = []; 
  showSearchResults = true;

  // Definir las rutas posibles como un tipo literal
  private breadcrumbMap: { [key in 'home' | 'imagenes' | 'monitoreo' | 'animales' | 'mediciones' | 'logs' | 'diagramas']: string } = {
    'home': 'Inicio',
    'imagenes': 'Imágenes',
    'monitoreo': 'Monitoreo',
    'animales': 'Animales',
    'mediciones': 'Mediciones',
    'logs': 'Logs',
    'diagramas': 'Diagramas',
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Escuchar cambios de ruta para actualizar el breadcrumb
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

  // Función que se ejecuta cada vez que el usuario escribe en el campo de búsqueda
  onSearch(): void {
    // Aquí puedes implementar la lógica para filtrar o buscar dentro de tu contenido
    if (this.searchQuery.trim() !== '') {
      this.filterResults();
    } else {
      this.searchResults = [];  // Limpiar los resultados si no hay búsqueda
    }
  }

  // Función para filtrar resultados basados en la búsqueda
  filterResults(): void {
    // Aquí simulamos la búsqueda en páginas o datos. Este es solo un ejemplo.
    const pages = [
      { name: 'Inicio', path: 'home' },
      { name: 'Imágenes', path: 'imagenes' },
      { name: 'Monitoreo', path: 'monitoreo' },
      { name: 'Animales', path: 'animales' },
      { name: 'Mediciones', path: 'mediciones' },
      { name: 'Logs', path: 'logs' },
      { name: 'Diagramas', path: 'diagramas' }
    ];

    // Filtrar las páginas donde el nombre contiene el texto de búsqueda
    this.searchResults = pages.filter(page =>
      page.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  //Metodo para abrir 
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  // Método para cerrar el sidebar.
  closeSidebar() {
    this.isSidebarVisible = false;
  }
  
  // Método para cerrar los resultados de búsqueda.
  closeSearchResults() {
    this.showSearchResults = false;
  }
  
   // Detectar clics fuera del menú para cerrarlo.
  
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const searchResultsElement = document.querySelector('.search-results') as HTMLElement;
    const target = event.target as HTMLElement;

    // Si el clic fue fuera del contenedor de búsqueda y hay resultados, cerramos la búsqueda
    if (searchResultsElement && !searchResultsElement.contains(target)) {
      this.showSearchResults = false;  // Ocultamos los resultados de búsqueda
    }

    // Si el clic fue fuera del sidebar y está abierto, cerramos el sidebar
    const sidebar = document.getElementById('sidenav-main');

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
