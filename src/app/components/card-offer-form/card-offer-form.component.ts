import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
import {FormControl, FormGroup, Validators, FormBuilder} from "@angular/forms";
import {finalize} from "rxjs";
import {offerCreateModel} from "../../models/offer/offerCreateModel";
import {ToastrService} from "ngx-toastr";
import {OfferService} from "../../services/offer/offer.service";
import {UserService} from "../../services/user/user.service";
import {UserInfosModel} from "../../models/user/userInfosModel";

@Component({
  selector: 'app-card-offer-form',
  templateUrl: './card-offer-form.component.html',
  styleUrls: ['./card-offer-form.component.scss']
})
export class CardOfferFormComponent implements OnInit {
  cardId: string = "";
  private username: string|null = "";
  private userId: number = 0;

  offerForm: FormGroup = new FormGroup({
    quantity: new FormControl(1),
    price: new FormControl(0.01),
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

    this.getUserIdByUsername();

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


      console.log('Data to be sent:', formData);

      this.offerService.offerCreate(formData, this.cardId, this.userId).pipe(
        finalize(() => {
        })
      ).subscribe({
        next: () => {
          // Redirection vers la page de login après une inscription réussie
          this.router.navigate(['/card-detail/' + this.cardId]);
        },
        error: (e) => {
          const errorMessage = e?.error?.message || 'an unknown error has occured';
          this.toastr.error(errorMessage);
        },
        complete: () => this.toastr.success('Offer placed successfully', 'Succes')
      });
    }
  }

  public getUserIdByUsername() {
    if (this.username != null) {
      this.userService.userProfile(this.username).subscribe((data: UserInfosModel) => {
        this.userId = data.id;
      });
    }
  }

  public onSubmit(): void {
    this.createOffer();
  }
}
