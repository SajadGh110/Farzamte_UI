import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StickyFarzamteComponent } from './sticky-farzamte.component';

describe('StickyFarzamteComponent', () => {
  let component: StickyFarzamteComponent;
  let fixture: ComponentFixture<StickyFarzamteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StickyFarzamteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StickyFarzamteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
