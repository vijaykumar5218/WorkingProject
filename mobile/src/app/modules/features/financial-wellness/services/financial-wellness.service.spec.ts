import {TestBed} from '@angular/core/testing';

import {FinancialWellnessService} from './financial-wellness.service';

describe('FinancialWellnessService', () => {
  let service: FinancialWellnessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancialWellnessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
