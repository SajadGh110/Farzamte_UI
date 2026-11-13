import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallsDialog } from './calls-dialog';

describe('CallsDialog', () => {
  let component: CallsDialog;
  let fixture: ComponentFixture<CallsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
