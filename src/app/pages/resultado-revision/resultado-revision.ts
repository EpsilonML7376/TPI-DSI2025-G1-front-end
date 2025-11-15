import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { IEventoSismico } from '../../interfaces/IEventoSismico';
import { ServiceES } from '../../service/service-es.service';
import { ModalCargandoMapa } from '../../components/modal-cargando-mapa/modal-cargando-mapa';
import { ModalModificarES } from '../../components/modal-modificar-es/modal-modificar-es';
import { ModalFeedback } from '../../components/modal-feedback/modal-feedback';
import { SharedDataService } from '../../service/shared-data.service';

@Component({
  selector: 'app-resultado-revision',
  imports: [CommonModule, ModalCargandoMapa, ModalModificarES, ModalFeedback],
  templateUrl: './resultado-revision.html',
  styleUrl: './resultado-revision.css'
})
export class ResultadoRevision implements OnInit {

  eventoSismico: IEventoSismico | null = null;
  alcance: string = '';
  clasificacion: string = '';
  origenGeneracion: string = '';
  
  // Estados de habilitación
  botonVerMapaHabilitado: boolean = false;
  botonModificarHabilitado: boolean = false;
  seccionResultadoVisible: boolean = false;
  
  // Modales
  mostrarModalMapa: boolean = false;
  mostrarModalModificar: boolean = false;
  mostrarModalFeedback: boolean = false;
  
  // Datos del modal de feedback
  feedbackTipo: 'exito' | 'error' = 'exito';
  feedbackMensaje: string = '';
  feedbackTitulo: string = '';

  constructor(
    private serviceES: ServiceES,
    private router: Router,
    private route: ActivatedRoute,
    private sharedData: SharedDataService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    // Intentar obtener datos del navigation state primero
    const navigation = this.router.getCurrentNavigation();
    const stateFromNavigation = navigation?.extras?.state;
    const stateFromHistory = history.state;
    
    console.log('State de navegación:', stateFromNavigation);
    console.log('State de history:', stateFromHistory);
    
    // Intentar obtener datos del servicio compartido
    const sharedData = this.sharedData.getEventoData();
    console.log('Datos del servicio compartido:', sharedData);
    
    // Priorizar: navigation state > history state > servicio compartido
    let state: any = null;
    if (stateFromNavigation && stateFromNavigation['evento']) {
      state = stateFromNavigation;
      console.log('Usando datos de navigation state');
    } else if (stateFromHistory && stateFromHistory['evento']) {
      state = stateFromHistory;
      console.log('Usando datos de history state');
    } else if (sharedData.evento) {
      state = sharedData;
      console.log('Usando datos del servicio compartido');
    }
    
    if (state && state['evento']) {
      this.eventoSismico = state['evento'];
      this.alcance = state['alcance'] || '';
      this.clasificacion = state['clasificacion'] || '';
      this.origenGeneracion = state['origenGeneracion'] || '';
      
      console.log('Datos asignados:', {
        eventoSismico: this.eventoSismico,
        alcance: this.alcance,
        clasificacion: this.clasificacion,
        origenGeneracion: this.origenGeneracion
      });
    } else {
      console.warn('No se encontraron datos en ninguna fuente');
    }
    
    // Verificar que tenemos los datos necesarios
    if (!this.eventoSismico) {
      console.error('No hay evento sísmico, redirigiendo de vuelta...');
      // Si no hay datos, redirigir de vuelta
      this.router.navigate(['/reg-res-rev-manual']);
      return;
    }
    
    // Ejecutar los métodos según el flujo
    this.mostrarDatosEvento();
    this.habilitarOpcVerMapa();
    this.habilitarOpcModificarDatos();
    this.pedirSeleccionResultadoEvento();
  }

  mostrarDatosEvento(): void {
    // Este método se encarga de que los datos estén listos para renderizarse
    // La renderización real ocurre en el template
    console.log('Mostrando datos del evento:', this.eventoSismico);
  }

  habilitarOpcVerMapa(): void {
    this.botonVerMapaHabilitado = true;
  }

  habilitarOpcModificarDatos(): void {
    this.botonModificarHabilitado = true;
  }

  pedirSeleccionResultadoEvento(): void {
    this.seccionResultadoVisible = true;
  }

  verMapa(): void {
    if (this.botonVerMapaHabilitado) {
      this.mostrarModalMapa = true;
    }
  }

  modificarDatos(): void {
    if (this.botonModificarHabilitado) {
      this.mostrarModalModificar = true;
    }
  }

  cerrarModalMapa(): void {
    this.mostrarModalMapa = false;
  }

  cerrarModalModificar(): void {
    this.mostrarModalModificar = false;
  }

  tomarSeleccionResultado(opcion: string): void {
    if (!this.eventoSismico) {
      return;
    }

    // Convertir el evento a string
    const eventoString = this.eventoToString(this.eventoSismico);

    // Llamar al servicio
    console.log('Llamando a postSelectResult con:', { opcion, eventoString });
    this.serviceES.postSelectResult(opcion, eventoString).subscribe({
      next: (response: string) => {
        console.log('Resultado registrado (next):', response);
        console.log('Tipo de respuesta:', typeof response);
        
        // Determinar mensaje según la opción
        let mensaje = '';
        switch(opcion) {
          case 'Confirmado':
            mensaje = 'El evento sísmico ha sido confirmado exitosamente.';
            break;
          case 'Rechazado':
            mensaje = 'El evento sísmico ha sido rechazado exitosamente.';
            break;
          case 'Derivado a Experto':
            mensaje = 'El evento sísmico ha sido derivado a experto exitosamente.';
            break;
          default:
            mensaje = response || `El evento ha sido ${opcion.toLowerCase()} exitosamente.`;
        }
        
        // Mostrar modal de éxito
        this.feedbackTipo = 'exito';
        this.feedbackMensaje = mensaje;
        this.feedbackTitulo = 'Operación Exitosa';
        this.mostrarModalFeedback = true;
        
        console.log('Modal de feedback configurado:', {
          mostrarModalFeedback: this.mostrarModalFeedback,
          feedbackTipo: this.feedbackTipo,
          feedbackMensaje: this.feedbackMensaje
        });
        
        // Forzar detección de cambios
        this.cdr.detectChanges();
        
        // Limpiar datos del servicio compartido
        this.sharedData.clearEventoData();
      },
      error: (err) => {
        console.error('Error al registrar resultado:', err);
        
        // Determinar mensaje de error
        let mensajeError = 'Error al procesar la solicitud. Por favor, intente nuevamente.';
        if (err.error) {
          // Si el error tiene un mensaje, usarlo
          if (typeof err.error === 'string') {
            mensajeError = err.error;
          } else if (err.error.message) {
            mensajeError = err.error.message;
          }
        } else if (err.message) {
          mensajeError = `Error: ${err.message}`;
        }
        
        // Mostrar modal de error
        this.feedbackTipo = 'error';
        this.feedbackMensaje = mensajeError;
        this.feedbackTitulo = 'Error';
        this.mostrarModalFeedback = true;
        
        // Forzar detección de cambios
        this.cdr.detectChanges();
      }
    });
  }

  cerrarModalFeedback(): void {
    this.mostrarModalFeedback = false;
    // Redirigir a reg-res-rev-manual cuando se cierre el modal
    this.router.navigate(['/reg-res-rev-manual']);
  }

  confirmarEvento(): void {
    this.tomarSeleccionResultado('Confirmado');
  }

  rechazarEvento(): void {
    this.tomarSeleccionResultado('Rechazado');
  }

  solicitarRevisionExperto(): void {
    this.tomarSeleccionResultado('Derivado a Experto');
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
    
    return `fechaHoraOcurrencia=${fechaStr}, latitudEpicentro=${latEpicentro}, latitudHipocentro=${latHipocentro}, longitudEpicentro=${lonEpicentro}, longitudHipocentro=${lonHipocentro}, valorMagnitud=${magnitud}`;
  }

}

