import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { cartItemsGuard } from './cart-items.guard';

describe('cartItemsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => cartItemsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
