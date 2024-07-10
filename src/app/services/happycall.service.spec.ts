import { TestBed } from '@angular/core/testing';

import { HappycallService } from './happycall.service';

describe('HappycallService', () => {
  let service: HappycallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HappycallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
