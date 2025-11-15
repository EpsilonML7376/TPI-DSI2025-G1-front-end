import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoRevision } from './resultado-revision';

describe('ResultadoRevision', () => {
  let component: ResultadoRevision;
  let fixture: ComponentFixture<ResultadoRevision>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadoRevision]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadoRevision);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

