import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  constructor(private router: Router) {}

  public opcRegResultadoES(): void {
    this.router.navigate(['/reg-res-rev-manual']);
  }

  public opcCierreOrden(): void {
    console.log('Cierre de orden de inspección - fuera del scope de este proyecto');
  }

  public opcGenerarInforme(): void {
    console.log('Generar informe de gestión de sismos - fuera del scope de este proyecto');
  }
}
