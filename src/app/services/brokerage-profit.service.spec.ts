import { TestBed } from '@angular/core/testing';

import { BrokerageProfitService } from './brokerage-profit.service';

describe('BrokerageProfitService', () => {
  let service: BrokerageProfitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrokerageProfitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
