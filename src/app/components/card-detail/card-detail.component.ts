import { Component, OnInit } from '@angular/core';
import { CardDetailModel } from "../../models/card/cardDetailModel";
import { CardService } from "../../services/card/card.service";
import {ActivatedRoute, Router} from "@angular/router";
import {offerListByCardModel} from "../../models/offer/offerListByCardModel";
import {OfferService} from "../../services/offer/offer.service";
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent implements OnInit {
  private cardId: string = "";
  card: CardDetailModel = {} as CardDetailModel;
  isLoading: boolean = true;
  offerAvailable: boolean = false;
  offers: offerListByCardModel[] = [];

  constructor(private cardService: CardService, private actRoute: ActivatedRoute, private router: Router, private offerService: OfferService, private userService: UserService) {

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
        console.log(this.offers);
        this.offerAvailable = true;
      } else {
        this.offerAvailable = false;
      }
    });
  }

}
