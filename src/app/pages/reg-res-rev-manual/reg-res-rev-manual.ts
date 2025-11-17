import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IEventoSismico } from '../../interfaces/IEventoSismico';
import { ServiceES } from '../../service/service-es.service';
import { ModalConfirmacion } from '../../components/modal-confirmacion/modal-confirmacion';

@Component({
  selector: 'app-reg-res-rev-manual',
  imports: [CommonModule, ModalConfirmacion],
  templateUrl: './reg-res-rev-manual.html',
  styleUrl: './reg-res-rev-manual.css'
})
export class RegResRevManual implements OnInit {

  ESNoRevisados: IEventoSismico[] = []
  mostrarModal: boolean = false;
  eventoSeleccionado: IEventoSismico | null = null;
  mostrarTabla: boolean = false;
  cargando: boolean = true;

  constructor(
    private serviceES: ServiceES,
    private cdr: ChangeDetectorRef,
    private router: Router
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
          this.cargando = false;
          this.cdr.detectChanges(); // Forzar la detección de cambios
        },
        error: (err) => {
          console.error('Error al obtener ES no revisados:', err);
          this.cargando = false;
        }
      });
  }
  mostrarESParaSeleccion(): void {
    this.mostrarTabla = true;
  }
  
  // Navegar al home
  goBack(): void {
    this.router.navigate(['/']);
  }

  // trackBy para optimizar For: compone una clave estable y concisa
  trackByEvento(index: number, evento: IEventoSismico): string {
    return `${evento.fechaHoraOcurrencia}-${evento.latitudEpicentro}-${evento.longitudEpicentro}-${index}`;
  }

  tomarSeleccionES(evento: IEventoSismico, confirmar: boolean = false): void {
    if (!confirmar) {
      // Primera llamada: guardar el evento y abrir el modal
      this.eventoSeleccionado = evento;
      this.mostrarModal = true;
    } else {
      // Segunda fase: confirma selección y navega con los datos retornados
      if (this.eventoSeleccionado) {
        // Convertir el evento a string para enviarlo al backend
        const eventoString = this.eventoToString(this.eventoSeleccionado);
        this.serviceES.postSelectEvent(eventoString).subscribe({
          next: (response: string[]) => {
            // Extraer alcance, clasificacion y origen de la respuesta
            const [alcance, clasificacion, origenGeneracion] = response;
            
            // Preparar datos para navegación
            const navigationData = {
              evento: this.eventoSeleccionado,
              alcance: alcance,
              clasificacion: clasificacion,
              origenGeneracion: origenGeneracion
            };
            
            // Cerrar modal primero
            this.cerrarModal();
            
            // Navegar a la página de resultado de revisión con los datos
            // Usar setTimeout para asegurar que el modal se cierre antes de navegar
            setTimeout(() => {
              this.router.navigate(['/resultado-revision'], {
                state: navigationData
              });
            }, 100);
          },
          error: (err) => {
            console.error('Error al seleccionar evento:', err);
            this.cerrarModal();
          }
        });
      }
    }
  }

  cancelarSeleccion(): void {
    this.cerrarModal();
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.eventoSeleccionado = null;
  }

  // Formatea una fecha a "YYYY-MM-DD | HH:mm:ss" (hora local)
  // Acepta Date o string; devuelve 'N/A' o 'Fecha inválida' cuando corresponde
  formatFecha(fecha: Date | string | null | undefined): string {
    if (!fecha) {
      return 'N/A';
    }
    
    try {
      // Normaliza a instancia Date si llega como string
      const date = fecha instanceof Date ? fecha : new Date(fecha);
      
      // Valida fecha válida
      if (isNaN(date.getTime())) {
        console.warn('Fecha inválida:', fecha);
        return 'Fecha inválida';
      }
      
      // Construye partes con padding a 2 dígitos
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      // Ejemplo final: 2025-11-16 | 14:35:09
      return `${year}-${month}-${day} | ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.error('Error al formatear fecha:', error, fecha);
      return 'Error';
    }
  }

  // Serializa el evento al formato "clave=valor, ..." requerido por el backend
  // - Fecha: sin milisegundos ni sufijo "Z", hasta segundos (HH:mm:ss)
  // - Números decimales: punto -> coma (formato europeo)
  private eventoToString(evento: IEventoSismico): string {
    // Formatear fecha sin .000Z, solo hasta los segundos
    let fechaStr: string;
    if (evento.fechaHoraOcurrencia instanceof Date) {
      const date = evento.fechaHoraOcurrencia;
      fechaStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    } else {
      const date = new Date(evento.fechaHoraOcurrencia);
      fechaStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    }
    
    // Convertir puntos decimales a comas (formato europeo)
    const latEpicentro = evento.latitudEpicentro.replace('.', ',');
    const latHipocentro = evento.latitudHipocentro.replace('.', ',');
    const lonEpicentro = evento.longitudEpicentro.replace('.', ',');
    const lonHipocentro = evento.longitudHipocentro.replace('.', ',');
    const magnitud = evento.valorMagnitud.replace('.', ',');
    
    // Mantener el orden y nombres de claves esperados por el backend
    return `fechaHoraOcurrencia=${fechaStr}, latitudEpicentro=${latEpicentro}, latitudHipocentro=${latHipocentro}, longitudEpicentro=${lonEpicentro}, longitudHipocentro=${lonHipocentro}, valorMagnitud=${magnitud}`;
  }

}
