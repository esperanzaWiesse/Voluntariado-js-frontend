import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoUpadate } from './cargo-upadate';

describe('CargoUpadate', () => {
  let component: CargoUpadate;
  let fixture: ComponentFixture<CargoUpadate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargoUpadate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargoUpadate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
