import { Component } from '@angular/core';
import { CameraService } from '../../service/camera.service';

@Component({
  selector: 'app-monitoreo',
  imports: [],
  templateUrl: './monitoreo.component.html',
  styleUrl: './monitoreo.component.css'
})
export class MonitoreoComponent {

  constructor(private cameraService: CameraService){}

  // Funciones para iniciar y detener la cámara
  start() {
    this.cameraService.startCamera().subscribe(response => {
      console.log('Cámara iniciada:', response);
    }, error => {
      console.error('Error al iniciar la cámara:', error);
    });
  }

  stop() {
    this.cameraService.stopCamera().subscribe(response => {
      console.log('Cámara detenida:', response);
    }, error => {
      console.error('Error al detener la cámara:', error);
    });
  }
}

