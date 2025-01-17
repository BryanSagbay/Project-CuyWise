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
  imageBase64: string | null = null; // Imagen recibida
  isCameraOn: boolean = false; // Estado de la cámara

  constructor(private cameraService: CameraService) {}

  ngOnInit(): void {
    // Suscribirse a los frames del backend
    this.cameraService.getVideoFrame().subscribe({
      next: (imageBase64: string) => {
        this.imageBase64 = imageBase64; // Actualizar la imagen
      },
      error: (error) => console.error('Error al recibir frames:', error),
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
    // Detener la cámara si está activa al salir del componente
    if (this.isCameraOn) {
      this.stopCamera();
    }
  }
}
