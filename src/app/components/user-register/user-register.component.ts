import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { UserService } from "src/app/services/user/user.service";
import { UserCreateModel } from "src/app/models/user/userCreateModel";
import { ToastrService } from 'ngx-toastr';
import { finalize } from "rxjs";


@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit{
  submitted = false;

  registerForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    lastName: new FormControl(''),
    firstName: new FormControl(''),
    hasAddress: new FormControl(false),
    street: new FormControl(''),
    streetSecond: new FormControl(''),
    houseNumber: new FormControl(''),
    city: new FormControl(''),
    postalCode: new FormControl(''),
    region: new FormControl(''),
  });
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(64)
          ]
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(254)]
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(64)
          ]
        ],
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(64)
          ]
        ],
        hasAddress: [
          false
        ],
        street: [
          '',
          [
            Validators.minLength(2),
            Validators.maxLength(254)
          ]
        ],
        streetSecond: [
          '',
        ],
        houseNumber: [
          '',
          [
            Validators.minLength(1),
            Validators.maxLength(10),
          ]
        ],
        city: [
          '',
          [
            Validators.minLength(2),
            Validators.maxLength(128)
          ]
        ],
        postalCode: [
          '',
          [
            Validators.minLength(3),
            Validators.maxLength(10)
          ]
        ],
        region: [
          '',
          [
            Validators.minLength(2),
            Validators.maxLength(128),
          ]
        ],
        country: [
          'Belgium'
        ]
      },
    );

    this.registerForm.get('hasAddress')?.valueChanges.subscribe(
      (hasAddress: boolean) => {
        const addressFields = ['street', 'houseNumber', 'city', 'postalCode', 'region'];

        addressFields.forEach(field => {
          const control = this.registerForm.get(field);
          if (control) {
            if (hasAddress) {
              control.setValidators([Validators.required, Validators.minLength(2)]);
            } else {
              control.clearValidators();
            }
            control.updateValueAndValidity();
          }
        });
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  constructor(private formBuilder: FormBuilder, private userService: UserService, private toastr: ToastrService) {}


  public onSubmit(): void {
    this.submitted = true;
    // console.log(JSON.stringify(this.registerForm.value, null, 2));
    this.createUser();
  }

  public createUser() {
    if (this.registerForm.valid) {
      let formData: UserCreateModel;

      if (this.registerForm.value.hasAddress) {
        // Si hasAddress est true, toutes les données du formulaire sont envoyées
        formData = <UserCreateModel>this.registerForm.value;
      } else {
        // Si hasAddress est false, envoie uniquement les informations de base
        formData = {
          username: this.registerForm.value.username,
          email: this.registerForm.value.email,
          password: this.registerForm.value.password,
          lastName: this.registerForm.value.lastName,
          firstName: this.registerForm.value.firstName,
          hasAddress: this.registerForm.value.hasAddress
        };
      }

      console.log('Data to be sent:', formData);

      this.userService.userCreate(formData).pipe(
        finalize(() => {
        })
      ).subscribe({
        next: (v) => console.log(v),
        error: (e) => this.toastr.error(e),
        complete: () => this.toastr.success('Inscription réussie!', 'Succès')
      });
    }
  }
}
