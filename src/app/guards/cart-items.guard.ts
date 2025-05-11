import {CanActivate, Router} from '@angular/router';
import {CartService} from "../services/cart/cart.service";
import {CartItem} from "../models/cart/cartItemModel";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class cartItemsGuard {
  cartItems: CartItem[] = [];
  constructor(private cartService: CartService, private router: Router) {
  }

  canActivate(): boolean {
    this.cartService.cart$.subscribe(cart => {this.cartItems = cart;});
    if (this.cartItems.length > 0) {
      return true;
    } else {
      this.router.navigate(['home']);
      return false;
    }
  };
}
