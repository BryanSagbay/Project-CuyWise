import { Component } from '@angular/core';
import { DbConexionService } from '../../service/db-conexion.service';
import { CommonModule } from '@angular/common';
import { Animales } from '../../models/Animales';

@Component({
  selector: 'app-animales',
  imports: [CommonModule],
  templateUrl: './animales.component.html',
  styleUrl: './animales.component.css'
})
export class AnimalesComponent {

  animales: Animales[] = [];

  constructor(private DbConexionService:DbConexionService){

}
// Función para obtener los animales 
ngOnInit(){
  this.DbConexionService.getAnimales().subscribe( (data:Animales[]) => {
    this.animales = data
  },
  (error) => {
    console.error('Error al obtener animales:', error);
  });
}

// Funciones para cambiar el estado de los animales
getBadgeClass(isActive: boolean): string {
  return isActive ? 'badge badge-sm bg-success text-white' : 'badge badge-sm bg-danger text-white';
}

// Funciones para cambiar el estado de los animales
getStatusText(isActive: boolean): string {
  return isActive ? 'Activo' : 'Inactivo';
}

}
