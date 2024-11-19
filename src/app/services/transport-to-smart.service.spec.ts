import { TestBed } from '@angular/core/testing';

import { TransportToSmartService } from './transport-to-smart.service';

describe('TransportToSmartService', () => {
  let service: TransportToSmartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransportToSmartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
