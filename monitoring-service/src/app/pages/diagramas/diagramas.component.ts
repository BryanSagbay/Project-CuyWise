import { Component } from '@angular/core';
import { DbConexionService } from '../../service/db-conexion.service';
import { Datos } from '../../models/Datos';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-diagramas',
  imports: [CommonModule],
  templateUrl: './diagramas.component.html',
  styleUrl: './diagramas.component.css'
})
export class DiagramasComponent {

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
