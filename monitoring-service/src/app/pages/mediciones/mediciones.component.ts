import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DbConexionService } from '../../service/db-conexion.service';
import { Datos } from '../../models/Datos';

@Component({
  selector: 'app-mediciones',
  imports: [CommonModule],
  templateUrl: './mediciones.component.html',
  styleUrl: './mediciones.component.css'
})
export class MedicionesComponent {

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

