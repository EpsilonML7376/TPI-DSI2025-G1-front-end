import { Injectable } from '@angular/core';
import { IEventoSismico } from '../interfaces/IEventoSismico';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private eventoData: {
    evento: IEventoSismico | null;
    alcance: string;
    clasificacion: string;
    origenGeneracion: string;
  } = {
    evento: null,
    alcance: '',
    clasificacion: '',
    origenGeneracion: ''
  };

  setEventoData(evento: IEventoSismico, alcance: string, clasificacion: string, origenGeneracion: string): void {
    this.eventoData = {
      evento,
      alcance,
      clasificacion,
      origenGeneracion
    };
  }

  getEventoData(): { evento: IEventoSismico | null; alcance: string; clasificacion: string; origenGeneracion: string } {
    return this.eventoData;
  }

  clearEventoData(): void {
    this.eventoData = {
      evento: null,
      alcance: '',
      clasificacion: '',
      origenGeneracion: ''
    };
  }
}

