import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEventoSismico } from '../interfaces/IEventoSismico';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceES {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getESNoRevisados(): Observable<IEventoSismico[]> {
    return this.http.get<string[]>(`${this.baseUrl}/norevisados`).pipe(
      map((data: string[]) =>
        data.map((item: string) => {
          const [fechaHora, latEpi, latHip, longEpi, longHip, magnitud] = item.split(',');

          return {
            fechaHoraOcurrencia: new Date(fechaHora),
            latitudEpicentro: latEpi,
            latitudHipocentro: latHip,
            longitudEpicentro: longEpi,
            longitudHipocentro: longHip,
            valorMagnitud: magnitud
          } as IEventoSismico;
        })
      )
    );
  }

  postSelectEvent(event:string): Observable<any> {
    return this.http.post(`${this.baseUrl}/seleccion-evento`, { event })
  }

  postSelectResult(selection:string, evento: string): Observable<any> {
      return this.http.post(`${this.baseUrl}/seleccion-resultado`, { selection, evento })
    }
}