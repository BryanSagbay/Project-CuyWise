import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CameraService } from '../../service/camera.service';

@Component({
  selector: 'app-monitoreo',
  imports: [],
  templateUrl: './monitoreo.component.html',
  styleUrl: './monitoreo.component.css'
})
export class MonitoreoComponent {

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  mediaStream!: MediaStream; 

  constructor(private cameraService: CameraService){}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.stop();
  }

  start(): void {
    // Accede a la cámara usando getUserMedia
    navigator.mediaDevices
      .getUserMedia({ video: true }) // Configura solo video, sin audio
      .then((stream) => {
        this.mediaStream = stream;
        const video = this.videoElement.nativeElement;
        video.srcObject = stream; // Asigna el stream al elemento video
        video.play(); // Reproduce el video
      })
      .catch((error) => {
        console.error('Error al acceder a la cámara:', error);
      });
  }

  stop(): void {
    if (this.mediaStream) {
      // Detén todas las pistas del stream
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null!;
    }
  }
}

