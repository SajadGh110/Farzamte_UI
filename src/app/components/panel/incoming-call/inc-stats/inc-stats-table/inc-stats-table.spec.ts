import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncStatsTable } from './inc-stats-table';

describe('IncStatsTable', () => {
  let component: IncStatsTable;
  let fixture: ComponentFixture<IncStatsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncStatsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncStatsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
