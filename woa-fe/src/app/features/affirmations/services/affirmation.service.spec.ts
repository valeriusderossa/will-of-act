import { TestBed } from '@angular/core/testing';

import { AffirmationService } from './affirmation.service';

describe('AffirmationService', () => {
  let service: AffirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AffirmationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
