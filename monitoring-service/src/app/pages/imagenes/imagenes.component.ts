import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Datos } from '../../models/Datos';
import { DbConexionService } from '../../service/db-conexion.service';

@Component({
  selector: 'app-imagenes',
  imports: [CommonModule],
  templateUrl: './imagenes.component.html',
  styleUrl: './imagenes.component.css'
})
export class ImagenesComponent {

  dato: Datos = new Datos();
  bandera: boolean=false;
  datos: Datos[] = [];

  constructor(private DbConexionService:DbConexionService){

}
ngOnInit() {
  if (this.bandera) return;
  this.DbConexionService.getAllData().subscribe((data: Datos[]) => {
    this.datos = data.map(item => ({
      ...item,
      imageUrl: `data:image/jpeg;base64,${item.imagen_medicion}`
    }));
  });
  this.dato = new Datos();
}
}

