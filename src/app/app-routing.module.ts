import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegisterComponent } from "./components/user-register/user-register.component";
import { CardListComponent } from "./components/card-list/card-list.component";
import { CardDetailComponent } from "./components/card-detail/card-detail.component";
import { LoginComponent } from "./components/login/login.component";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { AuthGuard } from "./guards/auth.guard";
import { CardOfferFormComponent } from "./components/card-offer-form/card-offer-form.component";
import { SellerGuideComponent } from "./components/seller-guide/seller-guide.component";
import { HomeComponent } from "./components/home/home.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'user-register', component: UserRegisterComponent },
  { path: 'card-list', component: CardListComponent },
  { path: 'card-detail/:id', component: CardDetailComponent, pathMatch: 'full'},
  { path: 'user-login', component: LoginComponent},
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'card-offer-form/:id', component: CardOfferFormComponent, canActivate: [AuthGuard] },
  { path: 'seller-guide', component: SellerGuideComponent },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
