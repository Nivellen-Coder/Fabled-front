import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../services/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): boolean {
    if (this.authService.isLogged) {
      return true; // L'utilisateur est connecté, permet l'accès à la route
    } else {
      // L'utilisateur n'est pas connecté, redirige vers la page de connexion
      this.router.navigate(['/user-login']);
      return false;
    }
  }

}
