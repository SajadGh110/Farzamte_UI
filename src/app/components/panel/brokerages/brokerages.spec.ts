import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Brokerages } from './brokerages';

describe('DashboardComponent', () => {
  let component: Brokerages;
  let fixture: ComponentFixture<Brokerages>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Brokerages]
    });
    fixture = TestBed.createComponent(Brokerages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
