import { ComponentFixture, TestBed } from '@angular/core/testing';

import { View360Dialog } from './view360-dialog';

describe('View360Dialog', () => {
  let component: View360Dialog;
  let fixture: ComponentFixture<View360Dialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [View360Dialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(View360Dialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
