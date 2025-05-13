import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncStatsComponent } from './inc-stats.component';

describe('IncStatsComponent', () => {
  let component: IncStatsComponent;
  let fixture: ComponentFixture<IncStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
