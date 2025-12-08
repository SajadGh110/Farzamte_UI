import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriticalCallsDialogComponent } from './critical-calls-dialog.component';

describe('CriticalCallsDialogComponent', () => {
  let component: CriticalCallsDialogComponent;
  let fixture: ComponentFixture<CriticalCallsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriticalCallsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriticalCallsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
