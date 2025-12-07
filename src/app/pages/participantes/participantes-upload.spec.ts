import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantesUpload } from './participantes-upload';

describe('ParticipantesUpload', () => {
  let component: ParticipantesUpload;
  let fixture: ComponentFixture<ParticipantesUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantesUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantesUpload);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
