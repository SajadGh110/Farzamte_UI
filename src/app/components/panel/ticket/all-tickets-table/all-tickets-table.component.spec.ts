import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTicketsTableComponent } from './all-tickets-table.component';

describe('AllTicketsTableComponent', () => {
  let component: AllTicketsTableComponent;
  let fixture: ComponentFixture<AllTicketsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllTicketsTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllTicketsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
