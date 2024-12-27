import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Datos } from '../../models/Datos';
import { DbConexionService } from '../../service/db-conexion.service';

@Component({
  selector: 'app-logs',
  imports: [CommonModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css'
})
export class LogsComponent {


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
