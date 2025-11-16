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

  /**
   * Obtiene ES no revisados y los transforma de string[] a IEventoSismico[].
   * El backend envía cada evento como "clave=valor, ..." (texto plano).
   */
  getESNoRevisados(): Observable<IEventoSismico[]> {
    return this.http.get<string[]>(`${this.baseUrl}/norevisados`).pipe(
      // Transforma el string[] crudo en una lista tipada de IEventoSismico
      map((data: string[]) =>
        data.map((item: string) => {
          // Divide por ", " para obtener pares clave=valor (formato esperado)
          const pairs = item.split(', ');
          
          // Diccionario temporal clave -> valor para acceso simple
          const parsed: Record<string, string> = {};
          
          pairs.forEach(pair => {
            // Separa clave y valor por "=" (asume que solo hay un "=" por par)
            const [key, value] = pair.split('=');
            parsed[key] = value;
          });

          return {
            // Convierte la fecha a Date (idealmente en formato ISO del backend)
            fechaHoraOcurrencia: new Date(parsed['fechaHoraOcurrencia']),
            // Estos campos se mantienen como string según la interfaz actual
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

  postSelectEvent(event: string): Observable<string[]> {
    const params = new HttpParams().set('evento', event);
    return this.http.post<string[]>(`${this.baseUrl}/seleccion-evento`, null, { params });
  }

  postSelectResult(selection: string, evento: string): Observable<string> {
    const params = new HttpParams()
        .set('seleccion', selection)
        .set('evento', evento);
    // El backend devuelve un string con el mensaje de éxito o error
    // Usamos responseType: 'text' para manejar respuestas de texto plano
    return this.http.post(`${this.baseUrl}/seleccion-resultado`, null, { 
      params,
      responseType: 'text'
    }) as Observable<string>;
  }
}