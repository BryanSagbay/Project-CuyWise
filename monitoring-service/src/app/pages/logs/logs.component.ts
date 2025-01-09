import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DbConexionService } from '../../service/db-conexion.service';
import { Eventos } from '../../models/Eventos';

@Component({
  selector: 'app-logs',
  imports: [CommonModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css'
})
export class LogsComponent {

  eventos: Eventos[] = [];
  
  constructor(private DbConexionService:DbConexionService){

}
ngOnInit(){
  // Se obtienen los logs
  this.DbConexionService.getEvent().subscribe( (data:Eventos[]) => {
    this.eventos = data
  },
  (error) => {
    console.error('Error al obtener los logs:', error);
  });
}
}
