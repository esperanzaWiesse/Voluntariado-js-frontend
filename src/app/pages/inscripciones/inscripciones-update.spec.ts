import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionesUpdate } from './inscripciones-update';

describe('InscripcionesUpdate', () => {
  let component: InscripcionesUpdate;
  let fixture: ComponentFixture<InscripcionesUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscripcionesUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscripcionesUpdate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
