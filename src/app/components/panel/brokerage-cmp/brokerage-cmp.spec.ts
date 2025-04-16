import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerageCmp } from './brokerage-cmp';

describe('BrokerageCmpComponent', () => {
  let component: BrokerageCmp;
  let fixture: ComponentFixture<BrokerageCmp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrokerageCmp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrokerageCmp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
