import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Datos } from '../models/Datos';

@Injectable({
  providedIn: 'root'
})
export class DbConexionService {

  private url = 'http://localhost:4001';

  constructor(private http: HttpClient) { }

  // Método Get para obtener todos los datos de la base de datos
  getAllData(): Observable<Datos[]> {
    return this.http.get<Datos[]>(`${this.url}/pcws`).pipe(
      catchError(this.handleError)
    );
  }

  // Método Get para obtener los datos de la base de datos por id
  getDataId(id: number): Observable<Datos> {
    return this.http.get<Datos>(`${this.url}/pcws/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Método para manejar errores
  private handleError(error: HttpErrorResponse) {
    console.error('Ocurrió un error:', error.message);
    return throwError('Algo salió mal; por favor intenta nuevamente más tarde.');
  }
}
