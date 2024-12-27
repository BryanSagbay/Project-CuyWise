import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DbConexionService } from '../../service/db-conexion.service';
import { Mediciones } from '../../models/Mediciones';

@Component({
  selector: 'app-imagenes',
  imports: [CommonModule],
  templateUrl: './imagenes.component.html',
  styleUrl: './imagenes.component.css'
})
export class ImagenesComponent {

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

