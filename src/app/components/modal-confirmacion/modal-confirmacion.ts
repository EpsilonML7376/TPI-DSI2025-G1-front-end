import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-modal-confirmacion',
  imports: [],
  templateUrl: './modal-confirmacion.html',
  styleUrl: './modal-confirmacion.css',
})
export class ModalConfirmacion {
  @Input() titulo: string = 'Confirmar selección';
  @Input() mensaje: string = '¿Estás seguro de querer realizar esta acción?';
  @Input() mensajeAdicional: string = '';
  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  onConfirmar(): void {
    this.confirmar.emit();
  }

  onCancelar(): void {
    this.cancelar.emit();
  }
}
