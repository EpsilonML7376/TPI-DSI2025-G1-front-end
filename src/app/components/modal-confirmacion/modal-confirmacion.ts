import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal-confirmacion',
  imports: [],
  templateUrl: './modal-confirmacion.html',
  styleUrl: './modal-confirmacion.css',
})
export class ModalConfirmacion {
  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  onConfirmar(): void {
    this.confirmar.emit();
  }

  onCancelar(): void {
    this.cancelar.emit();
  }
}
