import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-feedback',
  imports: [CommonModule],
  templateUrl: './modal-feedback.html',
  styleUrl: './modal-feedback.css'
})
export class ModalFeedback {
  @Input() tipo: 'exito' | 'error' = 'exito';
  @Input() mensaje: string = '';
  @Input() titulo: string = '';
  @Output() cerrar = new EventEmitter<void>();

  onCerrar(): void {
    this.cerrar.emit();
  }

  getTitulo(): string {
    if (this.titulo) {
      return this.titulo;
    }
    return this.tipo === 'exito' ? 'Operación Exitosa' : 'Error';
  }

  getIcono(): string {
    return this.tipo === 'exito' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill';
  }
}

