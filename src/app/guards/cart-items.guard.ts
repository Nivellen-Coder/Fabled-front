import { Router } from '@angular/router';
import {CartService} from "../services/cart/cart.service";
import {CartItem} from "../models/cart/cartItemModel";
import {Injectable} from "@angular/core";
import {AuthService} from "../services/auth/auth.service";
import {map, Observable, take} from "rxjs";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})

export class cartItemsGuard {
  cartItems: CartItem[] = [];
  constructor(private cartService: CartService, private router: Router, private authService: AuthService, private toastr: ToastrService) {
  }

  canActivate(): Observable<boolean> {
    return this.cartService.cart$.pipe(
      map((cartItems: CartItem[]) => {
        const currentUserId = this.authService.loggedInUserId; // à adapter selon ta méthode
        const hasSameUserItem = cartItems.some(item => item.userId == currentUserId);
        if (hasSameUserItem) {
          this.toastr.error("You can't buy your own offers. Remove it to proceed to checkout")
          return false;
        }

        if (cartItems.length <= 0) {
          this.router.navigate(['home']);
          return false;
        }
        return true;
      })
    );
  };
}
