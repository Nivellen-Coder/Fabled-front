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
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router) {}

  login(): void {
    this.authService.login(this.username, this.password)
      .subscribe({
        next: () => {
          this.router.navigate(['/card-list']);
        },
        error: (e) => {
          const errorMessage = e?.error?.message || 'an unknown error has occured';
          this.toastr.error(errorMessage);
        },
        complete: () => this.toastr.success('Authentication completed successfully', 'Succes')
      });
  }
}
