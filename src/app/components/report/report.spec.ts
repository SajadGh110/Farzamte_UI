import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Report } from './report';

describe('ReportComponent', () => {
  let component: Report;
  let fixture: ComponentFixture<Report>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Report]
    });
    fixture = TestBed.createComponent(Report);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
