import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncUnitComponent } from './inc-unit.component';

describe('IncUnitComponent', () => {
  let component: IncUnitComponent;
  let fixture: ComponentFixture<IncUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncUnitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
