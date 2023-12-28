import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegisterComponent } from "./components/user-register/user-register.component";
import { CardListComponent } from "./components/card-list/card-list.component";
import { CardDetailComponent } from "./components/card-detail/card-detail.component";

const routes: Routes = [
  { path: 'user-register', component: UserRegisterComponent },
  { path: 'card-list', component: CardListComponent },
  { path: 'card-detail/:id', component: CardDetailComponent, pathMatch: 'full'},
  { path: '**', redirectTo: 'card-list' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
