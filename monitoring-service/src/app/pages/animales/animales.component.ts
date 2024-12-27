import { Component } from '@angular/core';
import { Datos } from '../../models/Datos';
import { DbConexionService } from '../../service/db-conexion.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-animales',
  imports: [CommonModule],
  templateUrl: './animales.component.html',
  styleUrl: './animales.component.css'
})
export class AnimalesComponent {

  dato: Datos = new Datos();
  bandera: boolean=false;
  datos: Datos[] = [];
  constructor(private DbConexionService:DbConexionService){

}
ngOnInit(){
  if(this.bandera)return;
  this.DbConexionService.getAllData().subscribe( (data:Datos[]) => {
    this.datos = data
  })
  this.dato=new Datos();
}
}
