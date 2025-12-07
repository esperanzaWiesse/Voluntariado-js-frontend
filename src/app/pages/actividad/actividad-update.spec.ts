import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadUpdate } from './actividad-update';

describe('ActividadUpdate', () => {
  let component: ActividadUpdate;
  let fixture: ComponentFixture<ActividadUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadUpdate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
