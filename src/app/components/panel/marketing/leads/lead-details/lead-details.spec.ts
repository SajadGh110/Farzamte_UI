import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadDetails } from './lead-details';

describe('LeadsDetails', () => {
  let component: LeadDetails;
  let fixture: ComponentFixture<LeadDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
