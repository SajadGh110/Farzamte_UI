import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HappyCall } from './happy-call';

describe('HappyCallComponent', () => {
  let component: HappyCall;
  let fixture: ComponentFixture<HappyCall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HappyCall]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HappyCall);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
