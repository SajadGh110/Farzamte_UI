import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTicketsTable } from './all-tickets-table';

describe('AllTicketsTableComponent', () => {
  let component: AllTicketsTable;
  let fixture: ComponentFixture<AllTicketsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllTicketsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTicketsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
