import { ComponentFixture, TestBed } from '@angular/core/testing';

import { View360 } from './view-360';

describe('View360Component', () => {
  let component: View360;
  let fixture: ComponentFixture<View360>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [View360]
    })
    .compileComponents();

    fixture = TestBed.createComponent(View360);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
