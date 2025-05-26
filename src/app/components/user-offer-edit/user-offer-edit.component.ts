import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user/user.service";
import {AuthService} from "../../services/auth/auth.service";
import {ToastrService} from "ngx-toastr";
import {OfferService} from "../../services/offer/offer.service";

@Component({
  selector: 'app-user-offer-edit',
  standalone: true,
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './user-offer-edit.component.html',
  styleUrl: './user-offer-edit.component.scss'
})
export class UserOfferEditComponent implements OnInit {
  offerEditForm: FormGroup;
  offerId: string = "";
  private userId: string = "";
  protected username: string|null = "";

  ngOnInit() {
    this.offerId = this.actRoute.snapshot.params['id'];

    if (this.authService.loggedInUsername) {
      this.username = this.authService.loggedInUsername;
    }

    if (!this.authService.loggedInUserId) {
      this.toastr.error('Access denied ! Please login first');
      return;
    } else {
      this.userId = this.authService.loggedInUserId;
      this.loadOffer();
    }
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private offerService: OfferService,
    private authService: AuthService,
    private toastr: ToastrService,
    private actRoute: ActivatedRoute,
  ) {
    this.offerEditForm = this.fb.group({
      quantity: ['', [Validators.required]],
      price: ['', [Validators.required]],
      editionLang: ['', [Validators.required]],
      cardCondition: ['', [Validators.required]],
      isFoil: [false, [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  public loadOffer(): void {
    this.userService.userOfferById(this.userId, this.offerId).subscribe({
        next: (data) => {
          if (!data) {
            this.toastr.error("Offer not found or access denied");
            return;
          }

          this.offerEditForm.patchValue({
            quantity: data.quantity,
            price: data.price,
            editionLang: data.editionLang,
            cardCondition: data.cardCondition,
            isFoil: data.isFoil,
            description: data.description,
          });
        },
        error: (err) => {
          this.toastr.error("Failed to load offer");
          console.error("API Error:", err);
        }
      });
  }

  public updateOffer(): void {
    if (this.offerEditForm.invalid) {
      this.toastr.error('Please fill the form correctly');
      return;
    }

    this.offerService.updateUserOffer(this.offerId, this.userId, this.offerEditForm.value).subscribe({
      next: (res) => {
        this.router.navigate(['/user-profile'])
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Something went wrong');
        console.error(err);
      },
      complete: () => {
        this.toastr.success('Offer updated successfully');
      }
    });
  }
}
