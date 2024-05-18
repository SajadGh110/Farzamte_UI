import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HappyCallComponent } from './happy-call.component';

describe('HappyCallComponent', () => {
  let component: HappyCallComponent;
  let fixture: ComponentFixture<HappyCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HappyCallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HappyCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
