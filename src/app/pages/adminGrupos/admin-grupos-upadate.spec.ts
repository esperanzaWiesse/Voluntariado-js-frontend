import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGruposUpadate } from './admin-grupos-upadate';

describe('AdminGruposUpadate', () => {
  let component: AdminGruposUpadate;
  let fixture: ComponentFixture<AdminGruposUpadate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminGruposUpadate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminGruposUpadate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
