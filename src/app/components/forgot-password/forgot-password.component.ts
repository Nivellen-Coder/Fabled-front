import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  email = '';
  message = '';
  error = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.http.post('http://127.0.0.1:8000/api/password/request-reset', { email: this.email }).subscribe({
      next: () => {
        this.message = "If an account exists with this email, a link has been sent.";
        this.error = '';
      },
      error: () => {
        this.message = '';
        this.error = "Ann error occurred.";
      }
    });
  }
}
