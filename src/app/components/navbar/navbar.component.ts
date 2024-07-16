import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth/auth.service";
import { NavigationEnd, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  isLoggedIn: boolean = false;
  isLoggedInUsername: string|null = null;
  navigationSubscription: any;
  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLogged;
    this.isLoggedInUsername = this.authService.loggedInUsername;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/user-login']);
    this.toastr.success('User has been logged out successfully !', 'Success');
  }

  private initialiseInvites() {
    this.isLoggedIn = this.authService.isLogged;
    this.isLoggedInUsername = this.authService.loggedInUsername;
  }
}
