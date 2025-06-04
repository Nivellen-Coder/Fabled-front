import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  newPassword = '';
  confirmPassword = '';
  message = '';
  error = '';
  token = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: ToastrService, private router: Router) {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.error = "The passwords do not match.";
      this.message = '';
      return;
    }

    this.http.post('http://127.0.0.1:8000/api/password/reset', {
      token: this.token,
      password: this.newPassword
    }).subscribe({
      next: () => {
        this.message = "Password changed successfully.";
        this.error = '';
        this.toastr.success(this.message);
        this.router.navigate(['/user-login']);
      },
      error: (err) => {
        this.error = err.error?.error || "Erreur lors de la réinitialisation.";
        this.message = '';
      }
    });
  }
}
