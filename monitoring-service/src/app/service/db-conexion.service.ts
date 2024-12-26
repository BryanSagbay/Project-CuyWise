import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbConexionService {

  private url = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  //Metodo Get obtenemos todos los datos de la base de datos
  getAllData(){
    return this.http.get(`${this.url}/pcws`);
  }

  //Metodo Get obtenemos los datos de la base de datos por id
  getDataId(id: number): Observable<any> {
    return this.http.get(`${this.url}/pcws/${id}`);
  }
}
