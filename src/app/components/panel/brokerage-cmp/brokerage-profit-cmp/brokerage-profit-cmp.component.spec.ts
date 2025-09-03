import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerageProfitCmpComponent } from './brokerage-profit-cmp.component';

describe('BrokerageProfitCmpComponent', () => {
  let component: BrokerageProfitCmpComponent;
  let fixture: ComponentFixture<BrokerageProfitCmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrokerageProfitCmpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrokerageProfitCmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
