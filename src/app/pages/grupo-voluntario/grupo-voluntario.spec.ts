import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoVoluntario } from './grupo-voluntario';

describe('GrupoVoluntario', () => {
  let component: GrupoVoluntario;
  let fixture: ComponentFixture<GrupoVoluntario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrupoVoluntario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrupoVoluntario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
