import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingCall } from './incoming-call';

describe('CallInComponent', () => {
  let component: IncomingCall;
  let fixture: ComponentFixture<IncomingCall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingCall]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingCall);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
