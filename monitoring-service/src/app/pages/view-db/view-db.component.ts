import { Component } from '@angular/core';
import { Datos } from '../../models/Datos';
import { DbConexionService } from '../../service/db-conexion.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-db',
  imports: [CommonModule],
  templateUrl: './view-db.component.html',
  styleUrl: './view-db.component.css'
})
export class ViewDBComponent {


  dato: Datos = new Datos();
  bandera: boolean=false;
  datos: Datos[] = [];
constructor(private DbConexionService:DbConexionService){

}
ngOnInit(){
this.DbConexionService.getAllData().subscribe( (data:Datos[]) => {
this.datos = data
})
this.dato=new Datos();
}
MostrarDatos(){
  if(this.bandera==false){
  this.DbConexionService.getAllData().subscribe( (data:Datos[]) => {
    this.datos = data
  })
  this.dato=new Datos();
}}



}
