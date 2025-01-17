import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  private socket: any;
  private url = 'http://localhost:4001';

  constructor(private http: HttpClient) {
    // Configura la conexión con el servidor Socket.IO
    this.socket = io(this.url); // Cambia el URL si es necesario
  }

  // Iniciar la cámara (solicitud HTTP)
  startCamera(): Observable<any> {
    return this.http.post<any>('http://localhost:5000/start_camera', {});
  }
  
  stopCamera(): Observable<any> {
    return this.http.post<any>('http://localhost:5000/stop_camera', {});
  }
  

  // Recibir frames de video en base64 desde el servidor
  getVideoFrame(): Observable<string> {
    return new Observable<string>((observer) => {
      this.socket.on('video_frame', (data: string) => {
        console.log('Frame recibido desde el servidor:', data.substring(0, 50)); // Muestra los primeros 50 caracteres
        observer.next(data);
      });      
    });
  }
}
