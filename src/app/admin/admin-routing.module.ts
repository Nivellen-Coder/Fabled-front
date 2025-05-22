import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AuthGuard } from "./guards/auth.guard";
import { UsersComponent } from "./users/users.component";
import { OffersComponent } from "./offers/offers.component";
import {AdminStatsComponent} from "./admin-stats/admin-stats.component";
import {ContactsComponent} from "./contacts/contacts.component";
import {OrdersComponent} from "./orders/orders.component";

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      { path: 'home', component: AdminStatsComponent, },  // Page d'accueil admin
      { path: 'users', component: UsersComponent },  // Liste des utilisateurs
      { path: 'offers', component: OffersComponent },
      { path: 'contacts', component: ContactsComponent },
      { path: 'orders', component: OrdersComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
