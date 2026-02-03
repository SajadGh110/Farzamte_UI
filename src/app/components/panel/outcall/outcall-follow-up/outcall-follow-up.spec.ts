import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutcallFollowUp } from './outcall-follow-up';

describe('OutcallFollowUp', () => {
  let component: OutcallFollowUp;
  let fixture: ComponentFixture<OutcallFollowUp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutcallFollowUp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutcallFollowUp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
