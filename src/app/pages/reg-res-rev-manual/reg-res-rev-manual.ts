import { Component } from '@angular/core';
import { IEventoSismico } from '../../interfaces/IEventoSismico';
import { ServiceES } from '../../service/service-es.service';

@Component({
  selector: 'app-reg-res-rev-manual',
  imports: [],
  templateUrl: './reg-res-rev-manual.html',
  styleUrl: './reg-res-rev-manual.css'
})
export class RegResRevManual {

  ESNoRevisados: IEventoSismico[] = []

  constructor(private serviceES: ServiceES) {}
  
  ngOnInit(): void {

    this.serviceES.getESNoRevisados().subscribe({
      next: (data) => this.ESNoRevisados = data,  
      // Manejo de errores
      error: (err) => console.error('Error al obtener ES no revisados:', err)
    });

  }

}
