import {Component, HostListener, OnInit} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import { NgFor } from '@angular/common';
import { LucideAngularModule } from "lucide-angular";
import { NgOptimizedImage } from '@angular/common'
import { CardDetailModel } from "../../models/card/cardDetailModel";
import { CardService } from "../../services/card/card.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {offerListByCardModel} from "../../models/offer/offerListByCardModel";
import {OfferService} from "../../services/offer/offer.service";
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss'],
  imports: [
    NgIf,
    NgFor,
    NgOptimizedImage,
    LucideAngularModule,
    RouterLink,
    NgClass,
  ],
  standalone: true
})
export class CardDetailComponent implements OnInit {
  private cardId: string = "";
  isSmallScreen: boolean = false;
  card: CardDetailModel = {} as CardDetailModel;
  isLoading: boolean = true;
  offerAvailable: boolean = false;
  offers: offerListByCardModel[] = [];
  totalItemsAvailable: number = 0;
  avgPrice: number = 0;
  // minPriceToday: number = 0;
  // dateOfToday: string = "";
  // lastTenDays: [string] = [""];
  // minPrices: [number] = [0];

  constructor(private cardService: CardService, private actRoute: ActivatedRoute, private router: Router, private offerService: OfferService, private userService: UserService) {
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
    // this.fillLastTenDays();
    // this.sortDates();
    this.loadOffers();
  }

  navigateToOfferForm() {
    this.router.navigate(['card-offer-form/' + this.cardId]);
  }

  loadOffers() {
    // @ts-ignore
    this.offerService.offerListByCardId(this.cardId).subscribe((data: offerListByCardModel[]) => {
      if (data) {
        this.offers = data;
        this.offers = data.sort((a, b) => a.price - b.price);
        this.totalItemsAvailable = 0;
        // const minPrice = this.offers[0].price;
        let total = 0;
        for (let o of this.offers) {
          this.totalItemsAvailable += o.quantity;
          total += o.price;
          // if(o.price <= minPrice){
          //   this.minPriceToday = o.price;
          // }
        }
        this.avgPrice = total / this.offers.length;
        this.avgPrice = parseFloat(this.avgPrice.toFixed(2));
        this.offerAvailable = true;
      } else {
        this.offerAvailable = false;
      }
    });

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateScreenSize();
  }

  private updateScreenSize(): void {
    const width = window.innerWidth;
    this.isSmallScreen = width < 768;
  }

}
