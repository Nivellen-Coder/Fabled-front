import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegisterComponent } from "./components/user-register/user-register.component";
import { CardListComponent } from "./components/card-list/card-list.component";
import { CardDetailComponent } from "./components/card-detail/card-detail.component";
import { LoginComponent } from "./components/login/login.component";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { ProfileEditComponent } from "./components/profile-edit/profile-edit.component";
import { AuthGuard } from "./guards/auth.guard";
import { CardOfferFormComponent } from "./components/card-offer-form/card-offer-form.component";
import { SellerGuideComponent } from "./components/seller-guide/seller-guide.component";
import { HomeComponent } from "./components/home/home.component";
import { AddressEditComponent } from "./components/address-edit/address-edit.component";
import {AddressCreateComponent} from "./components/address-create/address-create.component";
import {UserOfferEditComponent} from "./components/user-offer-edit/user-offer-edit.component";
import {CartComponent} from "./components/cart/cart.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'user-register', component: UserRegisterComponent },
  { path: 'card-list', component: CardListComponent },
  { path: 'card-detail/:id', component: CardDetailComponent, pathMatch: 'full'},
  { path: 'user-login', component: LoginComponent},
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'card-offer-form/:id', component: CardOfferFormComponent, canActivate: [AuthGuard] },
  { path: 'seller-guide', component: SellerGuideComponent },
  { path: 'user-profile-edit', component: ProfileEditComponent, canActivate: [AuthGuard] },
  { path: 'user-address-edit', component: AddressEditComponent, canActivate: [AuthGuard] },
  { path: 'user-address-create', component: AddressCreateComponent, canActivate: [AuthGuard] },
  { path: 'user-offer-edit/:id' , component: UserOfferEditComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
