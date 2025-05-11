import {Component, OnInit} from '@angular/core';
import {CartService} from "../../services/cart/cart.service";
import {UserService} from "../../services/user/user.service";
import {finalize, Observable, tap} from "rxjs";
import {CartItem} from "../../models/cart/cartItemModel";
import {Address, UserInfosModel} from "../../models/user/userInfosModel";
import {AuthService} from "../../services/auth/auth.service";
import {data} from "autoprefixer";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AddressService} from "../../services/address/address.service";
import {Country} from "../../models/user/userCreateModel";
import {CountryService} from "../../services/country/country.service";

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgIf,
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  countries: Country[] = [];
  address: Address | undefined;
  addressFormGroup!: FormGroup;
  subtotal = 0;
  tax = 0;
  total = 0;
  userId: string | null = this.authService.loggedInUserId;
  showAddressModal = false;

  constructor(private fb: FormBuilder, private countryService: CountryService, private addressService: AddressService, private cartService: CartService, private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.addressFormGroup = this.fb.group({
      street: ['', [Validators.required, Validators.minLength(3)]],
      houseNumber: ['', [Validators.required, Validators.minLength(2)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      region: ['', [Validators.required, Validators.minLength(2)]],
      postalCode: ['', [Validators.required, Validators.minLength(2)]],
      country: [[], [Validators.required]],
    });

    this.cartService.cart$.subscribe((data) => {
        this.cartItems = data;
    });
    this.userService.userProfile(this.userId).subscribe((data: UserInfosModel) => {
        this.address = data.address;
    });
    this.countryService.countryList().pipe(
      tap((data: Country[]) => {
        this.countries = data;
      }),
      finalize(() => {
      })
    ).subscribe();
    this.calculateTotal();
  }

  calculateTotal() {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.tax = +(this.subtotal * 0.21).toFixed(2);
    this.total = +(this.subtotal + this.tax).toFixed(2);
  }

  saveAddress(): void {
    if (this.addressFormGroup.valid) {
      const newAddress = this.addressFormGroup.value;
      this.addressService.createAddress(this.userId, newAddress).subscribe(response => {
        this.address = newAddress;
        location.reload();
      });
    }
  }

  proceedToPayment() {
    console.log('Paiement en cours...');
  }
}
