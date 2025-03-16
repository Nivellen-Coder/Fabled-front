import {Component, OnInit} from '@angular/core';
import {finalize, tap} from "rxjs";
import {Country} from "../../models/user/userCreateModel";
import { CountryService } from "../../services/country/country.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../../services/user/user.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
import {NgForOf} from "@angular/common";
import {AddressService} from "../../services/address/address.service";

@Component({
  selector: 'app-address-edit',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './address-edit.component.html',
  styleUrl: './address-edit.component.scss'
})
export class AddressEditComponent implements OnInit {
  countries: Country[] = [];
  userCountry: string = '';
  protected username: string = '';
  private userId: string = '';
  addressForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private toastr: ToastrService,
              private countryService: CountryService,
              private addressService: AddressService,
              private router: Router,
              private authService: AuthService)
  {
    this.addressForm = this.formBuilder.group({
      street: ['', [Validators.required, Validators.minLength(3)]],
      houseNumber: ['', [Validators.required, Validators.minLength(2)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      region: ['', [Validators.required, Validators.minLength(2)]],
      postalCode: ['', [Validators.required, Validators.minLength(2)]],
      country: [[], [Validators.required]],
    });
  }

  ngOnInit() {

    if (this.authService.loggedInUsername) {
      this.username = this.authService.loggedInUsername;
    }

    if (!this.authService.loggedInUserId) {
      this.toastr.error('Access denied ! Please login first');
      return;
    } else {
      this.userId = this.authService.loggedInUserId;
      this.loadAddress();
    }

    this.countryService.countryList().pipe(
      tap((data: Country[]) => {
        this.countries = data;
      }),
      finalize(() => {
        // Code à exécuter lorsque l'observable est complet
      })
    ).subscribe();
  }

  public loadAddress(): void {
    this.userService.userProfile(this.userId).subscribe({
      next: (data) => {
        if (!data.address) {
          this.toastr.warning("No address found for this user.");
          return;
        }
        this.addressForm.patchValue({
          street: data.address.street || '',
          houseNumber: data.address.houseNumber || '',
          city: data.address.city || '',
          region: data.address.region || '',
          postalCode: data.address.postalCode || '',
          country: data.address.country || [],
        });
      },
      error: (err) => {
        this.toastr.error("Failed to load address");
        console.error(err);
      }
    });
  }

  public updateAddress(): void {
    if (this.addressForm.invalid) {
      this.toastr.error('Please fill the form correctly');
      return;
    }

    console.log('User ID:', this.userId);  // Vérifie si l’ID utilisateur est bien défini
    console.log('Payload:', this.addressForm.value); // Vérifie le JSON envoyé

    this.addressService.updateAddress(this.userId, this.addressForm.value).subscribe({
      next: (res) => {
        this.router.navigate(['/user-profile'])
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Something went wrong');
        console.error(err);
      },
      complete: () => {
        this.toastr.success('Profile updated successfully');
      }
    });
  }


}
