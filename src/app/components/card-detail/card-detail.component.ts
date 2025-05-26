import {Component, HostListener, Input, OnInit} from '@angular/core';
import {CurrencyPipe, NgClass, NgIf} from '@angular/common';
import { NgFor } from '@angular/common';
import { LucideAngularModule } from "lucide-angular";
import { NgOptimizedImage } from '@angular/common'
import { CardDetailModel } from "../../models/card/cardDetailModel";
import { CardService } from "../../services/card/card.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {offerListByCardModel} from "../../models/offer/offerListByCardModel";
import {OfferService} from "../../services/offer/offer.service";
import {UserService} from "../../services/user/user.service";
import {CartService} from "../../services/cart/cart.service";
import {ToastrService} from "ngx-toastr";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {data} from "autoprefixer";

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss'],
  imports: [
    NgIf,
    NgFor,
    NgOptimizedImage,
    LucideAngularModule,
    NgClass,
    FormsModule,
    CurrencyPipe,
  ],
  standalone: true
})
export class CardDetailComponent implements OnInit {
  private cardId: string = "";
  userId: string|null = null;
  isSmallScreen: boolean = false;
  card: CardDetailModel = {} as CardDetailModel;
  isLoading: boolean = true;
  offerAvailable: boolean = false;
  offers: offerListByCardModel[] = [];
  totalItemsAvailable: number = 0;
  avgPrice: number = 0;

  constructor(private cardService: CardService, private actRoute: ActivatedRoute, private router: Router, private offerService: OfferService, private authService: AuthService, private cartService: CartService, private toastr: ToastrService) {
    this.updateScreenSize();
  }

  ngOnInit(): void {
    this.cardId = this.actRoute.snapshot.params['id'];
    this.cardService.getCardById(this.cardId).subscribe((data: CardDetailModel) => {
      if(!this.card){
        this.isLoading = true;
      }
      this.card = data;
      this.isLoading = false;
    });
    this.userId = this.authService.loggedInUserId;
    this.loadOffers();
  }

  navigateToOfferForm() {
    this.router.navigate(['card-offer-form/' + this.cardId]);
  }

  loadOffers() {
    if (!this.cardId) {
      console.error('cardId est indéfini');
      this.offerAvailable = false;
      return;
    }

    // @ts-ignore
    this.offerService.offerListByCardId(this.cardId).subscribe({
      complete(): void {
      }, error(err: any): void {
      },
      next: (data: offerListByCardModel[]) => {
      if (data && data.length > 0) {
        this.offers = data
          .filter(a => a.quantity > 0)
          .sort((a, b) => a.price - b.price);

        this.totalItemsAvailable = this.offers.reduce((sum, o) => sum + o.quantity, 0);
        const total = this.offers.reduce((sum, o) => sum + o.price, 0);

        this.offers = this.offers.map(o => ({
          ...o,
          quantityToAdd: 1,
        }));

        this.avgPrice = parseFloat((total / this.offers.length).toFixed(2));
        this.offerAvailable = true;
      } else {
        this.offerAvailable = false;
      }
    }});
  }


  addToCart(offer: any) {
    const quantity = offer.quantityToAdd || 1;
    const maxStock = offer.quantity;

    if (quantity > maxStock) {
      this.toastr.warning('Quantity exceeded!');
      return;
    }

    if (offer) {
      this.cartService.addToCart({
        id: offer.id,
        name: this.card.name,
        price: offer.price,
        quantity: quantity,
      }, maxStock, quantity, offer.userId);
      this.toastr.success("Added to cart successfully.");
    } else {
      this.toastr.error("Something went wrong.");
    }

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateScreenSize();
  }

  private updateScreenSize(): void {
    const width = window.innerWidth;
    this.isSmallScreen = width < 600;
  }

}
