// Prueba básica: verifica que el componente RegResRevManual se cree correctamente
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegResRevManual } from './reg-res-rev-manual';

describe('RegResRevManual', () => {
  let component: RegResRevManual;
  let fixture: ComponentFixture<RegResRevManual>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegResRevManual]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegResRevManual);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
