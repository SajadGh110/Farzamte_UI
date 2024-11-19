import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardContactComponent } from './dashboard-contact.component';

describe('DashboardContactComponent', () => {
  let component: DashboardContactComponent;
  let fixture: ComponentFixture<DashboardContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardContactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
