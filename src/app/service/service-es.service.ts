import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEventoSismico } from '../interfaces/IEventoSismico';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceES {

  private baseUrl = 'http://localhost:8080/reg-resultado-revision';

  constructor(private http: HttpClient) { }

  getESNoRevisados(): Observable<IEventoSismico[]> {
    return this.http.get<string[]>(`${this.baseUrl}/norevisados`).pipe(
      map((data: string[]) =>
        data.map((item: string) => {
          // Dividimos por ", " para obtener cada par clave=valor
          const pairs = item.split(', ');
          
          // Creamos un objeto para almacenar los valores parseados
          const parsed: Record<string, string> = {};
          
          pairs.forEach(pair => {
            const [key, value] = pair.split('=');
            parsed[key] = value;
          });

          return {
            fechaHoraOcurrencia: new Date(parsed['fechaHoraOcurrencia']),
            latitudEpicentro: parsed['latitudEpicentro'],
            latitudHipocentro: parsed['latitudHipocentro'],
            longitudEpicentro: parsed['longitudEpicentro'],
            longitudHipocentro: parsed['longitudHipocentro'],
            valorMagnitud: parsed['valorMagnitud']
          } as IEventoSismico;
        })
      )
    );
  }

  postSelectEvent(event: string): Observable<any> {
    const params = new HttpParams().set('evento', event);
    return this.http.post(`${this.baseUrl}/seleccion-evento`, null, { params });
  }

  postSelectResult(selection: string, evento: string): Observable<any> {
    const params = new HttpParams()
        .set('seleccion', selection)
        .set('evento', evento);
    return this.http.post(`${this.baseUrl}/seleccion-resultado`, null, { params });
  }
}