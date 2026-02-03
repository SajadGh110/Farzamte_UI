import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutcallGeneral } from './outcall-general';

describe('OutcallGeneral', () => {
  let component: OutcallGeneral;
  let fixture: ComponentFixture<OutcallGeneral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutcallGeneral]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutcallGeneral);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
