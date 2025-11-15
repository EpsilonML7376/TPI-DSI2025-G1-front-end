import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFeedback } from './modal-feedback';

describe('ModalFeedback', () => {
  let component: ModalFeedback;
  let fixture: ComponentFixture<ModalFeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFeedback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFeedback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

