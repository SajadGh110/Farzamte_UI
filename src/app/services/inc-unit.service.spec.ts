import { TestBed } from '@angular/core/testing';

import { IncUnitService } from './inc-unit.service';

describe('IncUnitService', () => {
  let service: IncUnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncUnitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
