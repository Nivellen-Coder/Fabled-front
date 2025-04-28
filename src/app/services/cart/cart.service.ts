import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {CartItem} from "../../models/cart/cartItemModel";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() {
    const savedCart = localStorage.getItem('cart');
    console.log('savedCart', savedCart);
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cart.next(this.cartItems);
    }
  }

  private cartItems: CartItem[] = [];
  private cart = new BehaviorSubject<CartItem[]>([]);

  cart$ = this.cart.asObservable();

  addToCart(product: any, maxStock: number, quantity: number = 1): boolean {
    const existing = this.cartItems.find(item => item.id === product.id);

    if (existing) {
      if (existing.quantity + quantity <= maxStock) {
        existing.quantity += quantity;
        this.updateCart();
        return true;
      } else {
        return false;
      }
    } else {
      if (quantity <= maxStock) {
        this.cartItems.push({ ...product, quantity });
        this.updateCart();
        return true;
      } else {
        return false;
      }
    }
  }

  removeFromCart(id: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== id);
    this.updateCart();
  }

  clearCart() {
    this.cartItems = [];
    this.updateCart();
  }

  getTotal() {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  private updateCart() {
    this.cart.next(this.cartItems);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }
}
