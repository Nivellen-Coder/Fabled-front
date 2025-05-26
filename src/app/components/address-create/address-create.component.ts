import {Component, OnInit} from '@angular/core';
import { NgForOf } from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {finalize, tap} from "rxjs";
import {Country} from "../../models/user/userCreateModel";
import {ToastrService} from "ngx-toastr";
import {CountryService} from "../../services/country/country.service";
import {AddressService} from "../../services/address/address.service";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-address-create',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './address-create.component.html',
  styleUrl: './address-create.component.scss'
})
export class AddressCreateComponent implements OnInit {
  countries: Country[] = [];
  protected username: string = '';
  private userId: string = '';
  addressForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
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
    }

    this.countryService.countryList().pipe(
      tap((data: Country[]) => {
        this.countries = data;
      }),
      finalize(() => {
      })
    ).subscribe();
  }

  public createAddress(): void {
    if (this.addressForm.invalid) {
      this.toastr.error('Please fill the form correctly');
      return;
    }

    this.addressService.createAddress(this.userId, this.addressForm.value).subscribe({
      next: (res) => {
        this.router.navigate(['/user-profile'])
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Something went wrong');
        console.error(err);
      },
      complete: () => {
        this.toastr.success('Address created successfully');
      }
    });
  }
}
