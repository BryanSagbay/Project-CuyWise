import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Animales } from '../models/Animales';
import { Mediciones } from '../models/Mediciones';
import { Eventos } from '../models/Eventos';

@Injectable({
  providedIn: 'root'
})
export class DbConexionService {

  // Url para conectar al backend nodejs
  private url = 'http://localhost:4001';

  constructor(private http: HttpClient) { }

  // Método para obtener animales
  getAnimales(): Observable<Animales[]> {
    return this.http.get<Animales[]>(`${this.url}/animales`).pipe(
      catchError(this.handleError)
  );
  }

  // Método para obtener mediciones
  getMedicion(): Observable<Mediciones[]> {
    return this.http.get<Mediciones[]>(`${this.url}/mediciones`).pipe(
      catchError(this.handleError)
    );
  }
  
  // Método para obtener eventos
  getEvent(): Observable<Eventos[]> {
    return this.http.get<Eventos[]>(`${this.url}/eventos`).pipe(
      catchError(this.handleError)
    );
  }

  // Método Get para obtener los datos de la base de datos por id
  getDataIdAnimal(id: number): Observable<Animales> {
    return this.http.get<Animales>(`${this.url}/animales/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  //Metodo para buscar por id de Medicion
  getDataIdMedicion(id: number): Observable<Mediciones> {
    return this.http.get<Mediciones>(`${this.url}/mediciones/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Metodo para buscar por id de Evento
  getDataIdEvent(id: number): Observable<Eventos> {
    return this.http.get<Eventos>(`${this.url}/eventos/${id}`).pipe(
      catchError(this.handleError)
    );  
  }
  
  // Método para obtener distribución de razas
  getDistribucionRazas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/graficos/distribucion-razas`).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obtener animales activos vs inactivos
  getAnimalesActivosInactivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/graficos/activos-inactivos`).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obtener evolución del peso por animal
  getEvolucionPesoPorAnimal(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/graficos/evolucion-peso`).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obtener eventos por tipo
  getEventosPorTipo(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/graficos/eventos-tipo`).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obtener el número de mediciones por animal
  getMedicionesPorAnimal(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/graficos/mediciones-por-animal`).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obtener registro de animales por mes/año
  getAnimalesPorMesAnio(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/graficos/animales-por-mes`).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obtener relación peso vs fecha de medición
  getRelacionPesoFecha(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/graficos/relacion-peso-fecha`).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obtener el promedio de peso por raza
  getPromedioPesoPorRaza(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/graficos/promedio-peso-raza`).pipe(
      catchError(this.handleError)
    );
  }

  // Método para manejar errores
  private handleError(error: HttpErrorResponse) {
    console.error('Ocurrió un error:', error.message);
    return throwError('Algo salió mal; por favor intenta nuevamente más tarde.');
  }
}
