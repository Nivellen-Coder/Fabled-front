import { Component, NgModule, OnInit, Renderer2, RendererFactory2 } from '@angular/core';
import {AuthService} from "./services/auth/auth.service";
import {Router} from "@angular/router";


// @ts-ignore
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.loadTheme();
  }

  // renderer: any;
  title: any;
  public theme: string = 'light';
  private renderer: Renderer2;
  private isDarkMode: boolean = false;

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
      this.theme = "dark";
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
      this.theme = "light";
    }

    this.toggleTheme();
  }

  isDarkModeActive(): boolean {
    return this.isDarkMode;
  }

  constructor(rendererFactory: RendererFactory2, private authService: AuthService, private router: Router) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.loadTheme();
  }

  toggleTheme() {
    localStorage.setItem('theme', this.theme);
  }

  loadTheme() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      this.theme = storedTheme;
      this.isDarkMode = this.theme === 'dark';
      this.toggleDarkMode();
    } else {
      this.theme = 'light';
      this.isDarkMode = false;
      this.toggleDarkMode();
    }
  }

  isAdmin(): boolean {
    let user = this.authService.getCurrentUser();
    return !!(user && user.roles.includes('ROLE_ADMIN'));
  }
}
