import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  private socket: any;

  constructor(private http: HttpClient) {
    // Configura la conexión con el servidor Socket.IO
    this.socket = io('http://localhost:4001'); // Cambia el URL si es necesario
  }

  // Iniciar la cámara (solicitud HTTP)
  startCamera(): Observable<any> {
    return this.http.post<any>('http://localhost:5000/start_camera', {});
  }
  
  // Para la camara 
  stopCamera(): Observable<any> {
    return this.http.post<any>('http://localhost:5000/stop_camera', {});
  }
  

  // Recibir frames de video en base64 desde el servidor
  getVideoFrame(): Observable<string> {
    return new Observable<string>((observer) => {
      this.socket.on('video_frame', (data: string) => {
        console.log('Frame recibido:', data.substring(0, 50)); // Primeros 50 caracteres
        observer.next(data);
    });         
    });
  }
  
}
