import { TestBed } from '@angular/core/testing';

import { AdminOfferService } from './admin-offer.service';

describe('AdminOfferService', () => {
  let service: AdminOfferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminOfferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
