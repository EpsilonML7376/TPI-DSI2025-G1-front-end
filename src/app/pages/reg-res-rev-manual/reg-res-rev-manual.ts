import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { IEventoSismico } from '../../interfaces/IEventoSismico';
import { ServiceES } from '../../service/service-es.service';

@Component({
  selector: 'app-reg-res-rev-manual',
  imports: [CommonModule],
  templateUrl: './reg-res-rev-manual.html',
  styleUrl: './reg-res-rev-manual.css'
})
export class RegResRevManual implements OnInit {

  ESNoRevisados: IEventoSismico[] = []
  mostrarTabla: boolean = false;

  constructor(
    private serviceES: ServiceES,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.abrirPantalla();
  }

  abrirPantalla(): void {
    this.nuevaRevisionES();
    this.mostrarESParaSeleccion();
  }
  
  nuevaRevisionES(): void {
    this.serviceES.getESNoRevisados().subscribe({
        next: (data) => {
          this.ESNoRevisados = data || [];
          this.cdr.detectChanges(); // Forzar la detección de cambios
        },
        error: (err) => console.error('Error al obtener ES no revisados:', err)
      });
  }
  mostrarESParaSeleccion(): void {
    this.mostrarTabla = true;
  }
  
  // Navegar hacia atrás, esto no estaba presente en el analisis
  goBack(): void {
    this.location.back();
  }

  trackByEvento(index: number, evento: IEventoSismico): string {
    return `${evento.fechaHoraOcurrencia}-${evento.latitudEpicentro}-${evento.longitudEpicentro}-${index}`;
  }

  tomarSeleccionES(evento: IEventoSismico): void {
    // Convertir el evento a string para enviarlo al backend
    const eventoString = this.eventoToString(evento);
    this.serviceES.postSelectEvent(eventoString).subscribe({
      next: (response) => {
        console.log('Evento seleccionado:', response);
        // Aquí se puede agregar navegación a otra pantalla si es necesario
      },
      error: (err) => console.error('Error al seleccionar evento:', err)
    });
  }

  formatFecha(fecha: Date | string | null | undefined): string {
    if (!fecha) {
      return 'N/A';
    }
    
    try {
      const date = fecha instanceof Date ? fecha : new Date(fecha);
      
      if (isNaN(date.getTime())) {
        console.warn('Fecha inválida:', fecha);
        return 'Fecha inválida';
      }
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      return `${year}-${month}-${day} | ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.error('Error al formatear fecha:', error, fecha);
      return 'Error';
    }
  }

  private eventoToString(evento: IEventoSismico): string {
    const fechaStr = evento.fechaHoraOcurrencia instanceof Date 
      ? evento.fechaHoraOcurrencia.toISOString() 
      : new Date(evento.fechaHoraOcurrencia).toISOString();
    
    return `fechaHoraOcurrencia=${fechaStr}, latitudEpicentro=${evento.latitudEpicentro}, latitudHipocentro=${evento.latitudHipocentro}, longitudEpicentro=${evento.longitudEpicentro}, longitudHipocentro=${evento.longitudHipocentro}, valorMagnitud=${evento.valorMagnitud}`;
  }

}
