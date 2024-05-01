import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTopmenuComponent } from './dashboard-topmenu.component';

describe('DashboardTopmenuComponent', () => {
  let component: DashboardTopmenuComponent;
  let fixture: ComponentFixture<DashboardTopmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTopmenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardTopmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
