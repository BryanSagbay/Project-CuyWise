import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CameraService } from '../../service/camera.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-monitoreo',
  imports: [CommonModule],
  templateUrl: './monitoreo.component.html',
  styleUrl: './monitoreo.component.css'
})
export class MonitoreoComponent  implements OnInit, OnDestroy {
  imageBase64: string | null = null; // Imagen en base64 recibida desde el backend
  isCameraOn: boolean = false; // Estado de la cámara

  constructor(private cameraService: CameraService) {}

  ngOnInit(): void {
    this.cameraService.getVideoFrame().subscribe((imageBase64: string) => {
      console.log('Frame recibido y asignado:', imageBase64.substring(0, 50)); // Primeros 50 caracteres
      this.imageBase64 = imageBase64;
    });
  }  

  startCamera() {
    this.cameraService.startCamera().subscribe({
      next: (response) => {
        console.log(response.message); // "Camera started"
        this.isCameraOn = true;
      },
      error: (error) => {
        console.error('Error al iniciar la cámara:', error);
      },
    });
  }
  
  stopCamera() {
    this.cameraService.stopCamera().subscribe({
      next: (response) => {
        console.log(response.message); // "Camera stopped"
        this.isCameraOn = false;
      },
      error: (error) => {
        console.error('Error al detener la cámara:', error);
      },
    });
  }
  
  ngOnDestroy(): void {
    // Detener la cámara al destruir el componente
    if (this.isCameraOn) {
      this.stopCamera();
    }
  }
}