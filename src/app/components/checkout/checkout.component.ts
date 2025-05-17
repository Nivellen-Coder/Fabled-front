import {Component, OnInit, ViewChild} from '@angular/core';
import {CartService} from "../../services/cart/cart.service";
import {UserService} from "../../services/user/user.service";
import {CartItem} from "../../models/cart/cartItemModel";
import {AuthService} from "../../services/auth/auth.service";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {StripeCardComponent, StripeService} from "ngx-stripe";
import {PaymentMethodCreateParams, StripeCardElementOptions, StripeElementsOptions} from "@stripe/stripe-js";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {Router, RouterLink} from "@angular/router";
import {AddressService} from "../../services/address/address.service";
import {Address} from "../../models/user/userInfosModel";

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    StripeCardComponent,
    CurrencyPipe,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  @ViewChild(StripeCardComponent)
  card!: StripeCardComponent;
  userFirstName: string = "";
  userLastName: string = "";
  userId: string | null = "";
  addressId: string | null = "";
  address: Address | null = null;
  cartItems: CartItem[] = [];

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });
    this.userId = this.authService.loggedInUserId;
    this.userService.userProfile(this.userId).subscribe( async (user) => {
      this.addressId = user.address.id;
      this.userFirstName = user.firstName;
      this.userLastName = user.lastName;
      this.address = user.address;
    })
  }

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#aab7c4',
        fontWeight: '400',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      }
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  totalAmountCents: number = Math.round(this.cartService.getTotal() * 100);

  constructor(private stripeService: StripeService,
              private http: HttpClient,
              private cartService: CartService,
              private authService: AuthService,
              private userService: UserService,
              private addressService: AddressService,
              private toastr: ToastrService,
              private router: Router,
  ) {}

  pay(event: Event) {
    event.preventDefault();

    const totalAmountCents = this.totalAmountCents;
    const payload = {
      cart: this.cartItems.map(item => ({
        offer_id: item.id,
        quantity: item.quantity,
        unit_price: Math.round(item.price * 100),
      })),
      amount: totalAmountCents,
      user_id: this.userId,
      address_id: this.addressId
    };

    this.http.post<any>('http://localhost:8000/api/payment', {
      cart: payload.cart,
      amount: payload.amount,
      user_id: payload.user_id,
      address_id: payload.address_id,
    }).subscribe((paymentIntent: { clientSecret: any; }) => {
      const clientSecret = paymentIntent.clientSecret;

      this.stripeService.confirmCardPayment(clientSecret, {
        payment_method: { card: this.card.element }
      }).subscribe((result) => {
        if (result.error) {
          this.toastr.error(result.error.message);
        } else if (result.paymentIntent?.status === 'succeeded') {
          this.http.post('http://localhost:8000/api/orders/create', {
            payment_intent_id: result.paymentIntent.id,
            cart: payload.cart,
            user_id: payload.user_id,
            address_id: payload.address_id,
            total_amount: payload.amount,
          }).subscribe(() => {
            this.toastr.success('Payment Accepted', 'success');
            this.cartService.clearCart();
            this.router.navigate(['home']);
          });
        }
      });
    });
  }
}
