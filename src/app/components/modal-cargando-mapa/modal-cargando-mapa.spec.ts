import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCargandoMapa } from './modal-cargando-mapa';

describe('ModalCargandoMapa', () => {
  let component: ModalCargandoMapa;
  let fixture: ComponentFixture<ModalCargandoMapa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCargandoMapa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCargandoMapa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

