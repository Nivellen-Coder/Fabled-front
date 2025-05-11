import { Component } from '@angular/core';
import {CartItem} from "../../models/cart/cartItemModel";
import {CartService} from "../../services/cart/cart.service";
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  items: CartItem[] = [];
  total = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(data => {
      this.items = data;
      this.total = this.cartService.getTotal();
    });
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
  }

  clear() {
    this.cartService.clearCart();
  }

  goToCheckout() {
    this.router.navigate(['checkout']);
  }
}
