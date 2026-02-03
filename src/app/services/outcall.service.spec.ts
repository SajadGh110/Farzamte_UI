import { TestBed } from '@angular/core/testing';

import { OutcallService } from './outcall-service';

describe('OutcallService', () => {
  let service: OutcallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutcallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
