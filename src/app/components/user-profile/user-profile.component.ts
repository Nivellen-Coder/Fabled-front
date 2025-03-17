import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth/auth.service";
import { UserService } from "../../services/user/user.service";
import {Address, UserInfosModel} from 'src/app/models/user/userInfosModel';
import {offerListByUserIdModel} from "../../models/offer/offerListByUserIdModel";
import {CardService} from "../../services/card/card.service";
import {CardDetailModel} from "../../models/card/cardDetailModel";
import {Router, RouterLink} from "@angular/router";
import {OfferService} from "../../services/offer/offer.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  username: string = '';
  userId: string = '';
  userData : UserInfosModel = {} as UserInfosModel ;
  userOffers: offerListByUserIdModel = {} as offerListByUserIdModel;
  userAddress : Address = {} as Address;

  constructor(private authService: AuthService, private offerService: OfferService,private userService: UserService, private cardService: CardService, private router: Router,  private toastr: ToastrService) {

  }

  ngOnInit() {
    if (this.authService.loggedInUsername) {
      this.username = this.authService.loggedInUsername;
    }
    if (this.authService.loggedInUserId) {
      this.userId = this.authService.loggedInUserId;
    }

    this.userService.userProfile(this.userId).subscribe((data: UserInfosModel) => {
      this.userData = data;
      this.userAddress = data?.address;
    });

    this.userService.userOffersById(this.userId).subscribe((data: offerListByUserIdModel) => {
      if (data.offers) {
        data.offers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        this.userOffers = data;
        for (let o of this.userOffers.offers) {
          this.cardService.getCardById(o.cardId).subscribe((data: CardDetailModel) => {
            o.cardName = data.name;
          });
        }
      }
      console.log(data.offers);
    });
  }

  deleteUserOffer(offerId: number) {
    this.offerService.deleteUserOffer(offerId, this.userId).subscribe(({
      next: () => {
        this.toastr.success('Offer deleted successfully');
        location.reload(); //
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Failed to delete offer');
        console.error("Delete Error:", err);
      }
    }));
  }

  cardDetail(id: string) {
    this.router.navigate(['card-detail', id]);
  }

  navigateToOfferForm(offerId: number) {
    this.router.navigate(['user-offer-edit/', offerId]);
  }

}
