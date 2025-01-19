import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CameraService } from '../../service/camera.service';
import { CommonModule } from '@angular/common';
import { io } from 'socket.io-client';  // Asegúrate de importar socket.io-client

@Component({
  selector: 'app-monitoreo',
  imports: [CommonModule],
  templateUrl: './monitoreo.component.html',
  styleUrl: './monitoreo.component.css'
})
export class MonitoreoComponent implements OnInit, OnDestroy {
  private socket: any;
  public videoStream: string | null = null;
  private cameraStarted: boolean = false;

  constructor() {}

  ngOnInit(): void {

    this.socket = io('http://localhost:5000');  // Asegúrate de que coincida con tu puerto de Flask

    this.socket.on('video_frame', (imgBase64: string) => {
      this.videoStream = imgBase64;  // Recibir el base64 y mostrarlo en el frontend
    });
  }

  // Función para iniciar la cámara
  public startCamera(): void {
    if (this.cameraStarted) {
      console.log('La cámara ya está corriendo');
      return;
    }
  
    fetch('http://localhost:5000/start_camera', {
      method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
      console.log('Cámara iniciada:', data);
      this.cameraStarted = true;
    })
    .catch(err => {
      console.error('Error al iniciar la cámara:', err);
    });
  }
  
  // Función para detener la cámara
  public stopCamera(): void {
    if (!this.cameraStarted) {
      console.log('La cámara no está en marcha');
      return;  // Si la cámara ya está detenida, no hacer nada
    }
  
    fetch('http://localhost:5000/stop_camera', {
      method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
      console.log('Cámara detenida:', data);
      this.cameraStarted = false;
    })
    .catch(err => {
      console.error('Error al detener la cámara:', err);
    });
  }  
  
  // Limpiar la conexión del socket al destruir el componente
  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}