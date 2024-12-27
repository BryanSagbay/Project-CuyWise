import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DbConexionService } from '../../service/db-conexion.service';
import { Mediciones } from '../../models/Mediciones';

@Component({
  selector: 'app-mediciones',
  imports: [CommonModule],
  templateUrl: './mediciones.component.html',
  styleUrl: './mediciones.component.css'
})
export class MedicionesComponent {

  mediciones: Mediciones[] = [];

constructor(private DbConexionService:DbConexionService){

}
ngOnInit(){
  this.DbConexionService.getMedicion().subscribe( (data:Mediciones[]) => {
    this.mediciones = data
  },
  (error) => {
    console.error('Error al obtener las mediciones:', error);
  });
}
}

