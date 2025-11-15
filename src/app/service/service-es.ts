import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceES {

  constructor(private http: HttpClient) { }

  getESNoRevisados(): Observable<String[]> {
    return this.http.get<String[]>('http://localhost:8080/norevisados');
  }

  postSelectEvent(event:string): Observable<any> {
    return this.http.post('http://localhost:8080/seleccion-evento', { event })
  }

  postSelectResult(selection:string, evento: string): Observable<any> {
      return this.http.post('http://localhost:8080/seleccion-resultado', { selection, evento })
    }
}