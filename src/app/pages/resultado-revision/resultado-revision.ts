import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IEventoSismico } from '../../interfaces/IEventoSismico';
import { ServiceES } from '../../service/service-es.service';
import { ModalCargandoMapa } from '../../components/modal-cargando-mapa/modal-cargando-mapa';
import { ModalModificarES } from '../../components/modal-modificar-es/modal-modificar-es';
import { ModalFeedback } from '../../components/modal-feedback/modal-feedback';
import { ModalConfirmacion } from '../../components/modal-confirmacion/modal-confirmacion';

@Component({
  selector: 'app-resultado-revision',
  imports: [CommonModule, ModalCargandoMapa, ModalModificarES, ModalFeedback, ModalConfirmacion],
  templateUrl: './resultado-revision.html',
  styleUrl: './resultado-revision.css'
})
export class ResultadoRevision implements OnInit {

  eventoSismico: IEventoSismico | null = null;
  alcance: string = '';
  clasificacion: string = '';
  origenGeneracion: string = '';
  
  // Estados de habilitación
  datosEventoVisibles: boolean = false;
  botonVerMapaHabilitado: boolean = false;
  botonModificarHabilitado: boolean = false;
  seccionResultadoVisible: boolean = false;
  
  // Modales
  mostrarModalMapa: boolean = false;
  mostrarModalModificar: boolean = false;
  mostrarModalFeedback: boolean = false;
  mostrarModalConfirmacion: boolean = false;
  
  // Datos del modal de feedback
  feedbackTipo: 'exito' | 'error' = 'exito';
  feedbackMensaje: string = '';
  feedbackTitulo: string = '';
  
  // Datos del modal de confirmación
  accionConfirmar: string = '';
  confirmacionTitulo: string = '';
  confirmacionMensaje: string = '';
  procesandoAccion: boolean = false;

  constructor(
    private serviceES: ServiceES,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    // Obtener datos del navigation state usando history.state
    const state = history.state;
    
    if (state && state['evento']) {
      this.eventoSismico = state['evento'];
      this.alcance = state['alcance'] || '';
      this.clasificacion = state['clasificacion'] || '';
      this.origenGeneracion = state['origenGeneracion'] || '';
      
      // Ejecutar los métodos según el flujo
      this.mostrarDatosEvento();
      this.habilitarOpcVerMapa();
      this.habilitarOpcModificarDatos();
      this.pedirSeleccionResultadoEvento();
    } else {
      // Si no hay datos, redirigir de vuelta
      this.router.navigate(['/reg-res-rev-manual']);
    }
  }

  mostrarDatosEvento(): void {
    // Este método habilita la visualización de los datos del evento
    this.datosEventoVisibles = true;
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
    this.serviceES.postSelectResult(opcion, eventoString).subscribe({
      next: (response: string) => {
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
        
        // Cerrar modal de confirmación y mostrar modal de éxito
        this.procesandoAccion = false;
        this.mostrarModalConfirmacion = false;
        this.feedbackTipo = 'exito';
        this.feedbackMensaje = mensaje;
        this.feedbackTitulo = 'Operación Exitosa';
        this.mostrarModalFeedback = true;
        
        // Forzar detección de cambios
        this.cdr.detectChanges();
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
        
        // Cerrar modal de confirmación y mostrar modal de error
        this.procesandoAccion = false;
        this.mostrarModalConfirmacion = false;
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
    this.accionConfirmar = 'Confirmado';
    this.confirmacionTitulo = 'Confirmar Evento';
    this.confirmacionMensaje = '¿Estás seguro de que deseas confirmar este evento sísmico?';
    this.mostrarModalConfirmacion = true;
  }

  rechazarEvento(): void {
    this.accionConfirmar = 'Rechazado';
    this.confirmacionTitulo = 'Rechazar Evento';
    this.confirmacionMensaje = '¿Estás seguro de que deseas rechazar este evento sísmico?';
    this.mostrarModalConfirmacion = true;
  }

  solicitarRevisionExperto(): void {
    this.accionConfirmar = 'Derivado a Experto';
    this.confirmacionTitulo = 'Solicitar Revisión a Experto';
    this.confirmacionMensaje = '¿Estás seguro de que deseas solicitar la revisión de este evento sísmico a un experto?';
    this.mostrarModalConfirmacion = true;
  }

  onConfirmarAccion(): void {
    // No cerrar el modal de confirmación todavía, se cerrará cuando se muestre el modal de feedback
    // Activar indicador de carga
    this.procesandoAccion = true;
    this.tomarSeleccionResultado(this.accionConfirmar);
  }

  onCancelarAccion(): void {
    this.procesandoAccion = false;
    this.mostrarModalConfirmacion = false;
    this.accionConfirmar = '';
  }

  // Formatea una fecha a "YYYY-MM-DD | HH:mm:ss" (hora local)
  // Acepta Date o string; devuelve 'N/A'/'Fecha inválida' en casos no válidos
  formatFecha(fecha: Date | string | null | undefined): string {
    if (!fecha) {
      return 'N/A';
    }
    
    try {
      // Normaliza a instancia Date (si viene como string)
      const date = fecha instanceof Date ? fecha : new Date(fecha);
      
      // Valida que la fecha sea válida
      if (isNaN(date.getTime())) {
        console.warn('Fecha inválida:', fecha);
        return 'Fecha inválida';
      }
      
      // Construye componentes con padding a 2 dígitos
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      // Resultado final: YYYY-MM-DD | HH:mm:ss
      return `${year}-${month}-${day} | ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.error('Error al formatear fecha:', error, fecha);
      return 'Error';
    }
  }

  // Serializa el evento al formato de texto que espera el backend:
  // "clave=valor, ..." con fecha sin milisegundos ni zona y decimales con coma
  private eventoToString(evento: IEventoSismico): string {
    // Formatea fecha sin milisegundos ni sufijo "Z" (solo hasta los segundos)
    let fechaStr: string;
    if (evento.fechaHoraOcurrencia instanceof Date) {
      const date = evento.fechaHoraOcurrencia;
      fechaStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    } else {
      const date = new Date(evento.fechaHoraOcurrencia);
      fechaStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    }
    
    // Cambia punto decimal por coma (ej.: "-34.6" -> "-34,6")
    const latEpicentro = evento.latitudEpicentro.replace('.', ',');
    const latHipocentro = evento.latitudHipocentro.replace('.', ',');
    const lonEpicentro = evento.longitudEpicentro.replace('.', ',');
    const lonHipocentro = evento.longitudHipocentro.replace('.', ',');
    const magnitud = evento.valorMagnitud.replace('.', ',');
    
    // Orden y nombres de claves deben coincidir con lo que espera el backend
    return `fechaHoraOcurrencia=${fechaStr}, latitudEpicentro=${latEpicentro}, latitudHipocentro=${latHipocentro}, longitudEpicentro=${lonEpicentro}, longitudHipocentro=${lonHipocentro}, valorMagnitud=${magnitud}`;
  }

}

