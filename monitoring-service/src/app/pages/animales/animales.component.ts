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
ngOnInit(){
  this.DbConexionService.getAnimales().subscribe( (data:Animales[]) => {
    this.animales = data
    console.log(data);
  },
  (error) => {
    console.error('Error al obtener animales:', error);
  });
}
}
