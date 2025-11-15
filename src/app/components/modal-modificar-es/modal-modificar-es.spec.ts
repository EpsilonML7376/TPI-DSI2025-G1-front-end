import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalModificarES } from './modal-modificar-es';

describe('ModalModificarES', () => {
  let component: ModalModificarES;
  let fixture: ComponentFixture<ModalModificarES>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalModificarES]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalModificarES);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

