import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {AdminStatsComponent} from "../admin-stats/admin-stats.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  protected readonly AdminStatsComponent = AdminStatsComponent;
}
