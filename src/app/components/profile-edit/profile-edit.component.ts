import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../../services/user/user.service";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss'
})
export class ProfileEditComponent implements OnInit {
  profileForm: FormGroup;
  private userId: string|null = "";
  protected username: string|null = "";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['']
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
      this.loadProfile();
    }
  }

  public loadProfile(): void {
    this.userService.userProfile(this.userId).subscribe({
      next: (data) => {
        this.profileForm.patchValue({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        });
      },
      error: (err) => {
        this.toastr.error("Failed to load profile");
        console.error(err);
      }
    });
  }

  public updateProfile(): void {
    if (this.profileForm.invalid) {
      this.toastr.error('Please fill the form correctly');
      return;
    }

    this.userService.updateProfile(this.userId, this.profileForm.value).subscribe({
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
