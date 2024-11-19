import { TestBed } from '@angular/core/testing';

import { IncomingCallService } from './incoming-call.service';

describe('IncomingCallService', () => {
  let service: IncomingCallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncomingCallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
