import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerageCmpComponent } from './brokerage-cmp.component';

describe('BrokerageCmpComponent', () => {
  let component: BrokerageCmpComponent;
  let fixture: ComponentFixture<BrokerageCmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrokerageCmpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BrokerageCmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
