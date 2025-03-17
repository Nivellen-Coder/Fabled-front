import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastrModule } from 'ngx-toastr';
import { NgOptimizedImage } from "@angular/common";
import { LoginComponent } from './components/login/login.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CardOfferFormComponent } from './components/card-offer-form/card-offer-form.component';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import {
  CircleUserRound,
  File,
  Home,
  House,
  LogOut,
  Menu,
  Moon,
  Sun,
  UserCheck,
  UsersRound,
  Gem,
  ContactRound,
  FilePen,
  LogIn,
  TextSearch,
  SearchX,
  CircleOff,
  SquareMousePointer,
  PenLine,
  Pencil,
  Trash2,
} from "lucide-angular";

import { LucideAngularModule } from "lucide-angular";
import { SellerGuideComponent } from './components/seller-guide/seller-guide.component';
import { JwtInterceptor } from "./interceptors/jwt.interceptor";
import { AutoFocus } from './directives/auto-focus.directive';
import { HomeComponent } from './components/home/home.component';
import {NavbarComponent} from "./components/navbar/navbar.component";


@NgModule({ declarations: [
        AppComponent,
        UserRegisterComponent,
        LoginComponent,
        UserProfileComponent,
        CardOfferFormComponent,
        SellerGuideComponent,
        AutoFocus,
        HomeComponent,
    ],
    bootstrap: [AppComponent], imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    LucideAngularModule.pick({
      File,
      Home,
      Menu,
      UserCheck,
      Moon,
      Sun,
      CircleUserRound,
      LogOut,
      House,
      UsersRound,
      Gem,
      ContactRound,
      FilePen,
      PenLine,
      Pencil,
      Trash2,
      LogIn,
      TextSearch,
      SearchX,
      CircleOff,
      SquareMousePointer
    }),
    NavbarComponent,
  ], providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideCharts(withDefaultRegisterables())
    ]
})
export class AppModule { }
