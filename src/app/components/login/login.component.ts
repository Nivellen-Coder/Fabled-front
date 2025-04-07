import { Component } from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private apiURL = 'http://localhost:8000/api/login_check';
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router) {}

  login(): void {
    this.authService.login(this.username, this.password)
      .subscribe({
        next: (response) => {
          console.log("Réponse de l'API :", response); // DEBUG : Vérifier si le token est reçu

          if (response?.token) {
            localStorage.setItem('jwt', response.token); // Stocke le token
            this.toastr.success('Authentication completed successfully', 'Success');
            this.router.navigate(['/card-list']); // Redirection après stockage du token
          } else {
            this.toastr.error('Token not received. Please check API response.');
          }
        },
        error: (e) => {
          console.error("Erreur lors de l'authentification :", e); // DEBUG
          const errorMessage = e?.error?.message || 'An unknown error has occurred';
          this.toastr.error(errorMessage);
        }
      });
  }
}
