import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingCallDialog } from './incoming-call-dialog';

describe('IncomingCallDialog', () => {
  let component: IncomingCallDialog;
  let fixture: ComponentFixture<IncomingCallDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingCallDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingCallDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
