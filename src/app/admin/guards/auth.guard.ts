import {CanActivate, Router} from '@angular/router';
import {AuthService} from "../../services/auth/auth.service";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AuthGuard {

  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): boolean|null {
    const user = this.authService.getCurrentUser();
    if (user && user.roles.includes('ROLE_ADMIN')) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }

  }

}
