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

  private url = 'http://localhost:4001';

  constructor(private http: HttpClient) { }

  // Método Get para obtener todos los datos de la base de datos
  getDataAnimal(): Observable<Animales[]> {
    return this.http.get<Animales[]>(`${this.url}/animales`).pipe(
      catchError(this.handleError)
    );
  }

  getDataMedicion(): Observable<Mediciones[]> {
    return this.http.get<Mediciones[]>(`${this.url}/mediciones`).pipe(
      catchError(this.handleError)
    );
  }

  getDataEvent(): Observable<Eventos[]> {
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

  getDataIdMedicion(id: number): Observable<Mediciones> {
    return this.http.get<Mediciones>(`${this.url}/mediciones/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getDataIdEvent(id: number): Observable<Eventos> {
    return this.http.get<Eventos>(`${this.url}/eventos/${id}`).pipe(
      catchError(this.handleError)
    );  
  }
  
  // Método para manejar errores
  private handleError(error: HttpErrorResponse) {
    console.error('Ocurrió un error:', error.message);
    return throwError('Algo salió mal; por favor intenta nuevamente más tarde.');
  }
}
