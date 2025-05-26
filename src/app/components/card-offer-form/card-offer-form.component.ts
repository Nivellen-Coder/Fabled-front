import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
import {FormControl, FormGroup, Validators, FormBuilder} from "@angular/forms";
import {finalize} from "rxjs";
import {offerCreateModel} from "../../models/offer/offerCreateModel";
import {ToastrService} from "ngx-toastr";
import {OfferService} from "../../services/offer/offer.service";
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-card-offer-form',
  templateUrl: './card-offer-form.component.html',
  styleUrls: ['./card-offer-form.component.scss']
})
export class CardOfferFormComponent implements OnInit {
  cardId: string = "";
  username: string|null = "";
  userId: string|null = "";

  offerForm: FormGroup = new FormGroup({
    quantity: new FormControl(1),
    price: new FormControl(0.50),
    editionLang: new FormControl('English'),
    cardCondition: new FormControl('Near Mint'),
    isFoil: new FormControl(false),
    description: new FormControl(''),
  });


  constructor(private offerService: OfferService, private userService: UserService, private actRoute: ActivatedRoute, private authService: AuthService, private formBuilder: FormBuilder, private toastr: ToastrService, private router: Router) {

  }
  ngOnInit(): void {
    this.cardId = this.actRoute.snapshot.params['id'];

    this.username = this.authService.loggedInUsername;

    this.userId = this.authService.loggedInUserId;

    this.offerForm = this.formBuilder.group(
      {
        quantity: [
          1,
          [
            Validators.required,
          ]
        ],
        price: [
          0.01,
          [
            Validators.required,
            Validators.min(0.50)
          ]
        ],
        editionLang: [
          'English'
        ],
        cardCondition: [
          'Near Mint'
        ],
        isFoil: [
          false
        ],
        description: [
          ''
        ],
      },
    );
  }

  public createOffer() {
    if (this.offerForm.valid) {
      let formData: offerCreateModel;

      formData = <offerCreateModel>this.offerForm.value;

      this.offerService.offerCreate(formData, this.cardId, this.userId).pipe(
        finalize(() => {
        })
      ).subscribe({
        next: () => {
          this.router.navigate(['/card-detail/' + this.cardId]);
        },
        error: (e) => {
          const errorMessage = e?.error?.message || 'an unknown error has occured';
          this.toastr.error(errorMessage);
        },
        complete: () => this.toastr.success('Offer placed successfully', 'Success')
      });
    }
  }

  // public getUserIdByUsername() {
  //   this.userService.userProfile(this.username).subscribe((data: UserInfosModel) => {
  //     this.userId = data.id;
  //   });
  // }

  public onSubmit(): void {
    this.createOffer();
  }
}
