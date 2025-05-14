import { TestBed } from '@angular/core/testing';

import { IncStatService } from './inc-stat.service';

describe('IncStatService', () => {
  let service: IncStatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncStatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
