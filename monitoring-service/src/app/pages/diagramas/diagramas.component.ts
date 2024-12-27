import { Component } from '@angular/core';
import { DbConexionService } from '../../service/db-conexion.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-diagramas',
  imports: [CommonModule],
  templateUrl: './diagramas.component.html',
  styleUrl: './diagramas.component.css'
})
export class DiagramasComponent {

  constructor(private DbConexionService:DbConexionService){
  }

}
