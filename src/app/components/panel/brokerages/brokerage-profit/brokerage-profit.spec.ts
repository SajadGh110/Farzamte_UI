import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerageProfit } from './brokerage-profit';

describe('BrokerageProfitComponent', () => {
  let component: BrokerageProfit;
  let fixture: ComponentFixture<BrokerageProfit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrokerageProfit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrokerageProfit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
