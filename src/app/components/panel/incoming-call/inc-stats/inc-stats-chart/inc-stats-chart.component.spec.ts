import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncStatsChartComponent } from './inc-stats-chart.component';

describe('IncStatsChartComponent', () => {
  let component: IncStatsChartComponent;
  let fixture: ComponentFixture<IncStatsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncStatsChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncStatsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
