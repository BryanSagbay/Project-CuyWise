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

  constructor(private dbConexionService: DbConexionService) {}

  ngOnInit() {
    this.dbConexionService.getMedicion().subscribe(
      (data: Mediciones[]) => {
        this.mediciones = data; // Almacena directamente los datos
        console.log(this.mediciones);
      },
      (error) => {
        console.error('Error al obtener las mediciones:', error);
      }
    );
  }
}