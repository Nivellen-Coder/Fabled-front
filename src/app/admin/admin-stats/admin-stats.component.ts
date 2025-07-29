import {Component, OnInit} from '@angular/core';
import {LucideAngularModule} from "lucide-angular";
import {CurrencyPipe} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [
    LucideAngularModule,
    CurrencyPipe
  ],
  templateUrl: './admin-stats.component.html',
  styleUrl: './admin-stats.component.scss'
})
export class AdminStatsComponent implements OnInit {
  stats = {
    totalUsers: 0,
    totalOffers: 0,
    sales: 0,
    revenue: 0
  };
  constructor(private httpClient: HttpClient, private router: Router) { }

  ngOnInit() {
    this.httpClient.get<any>('https://fabled-project.onrender.com/api/admin/stats').subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => {
        console.error('Error: unable to retrieve stats', err);
      }
    });
  }
}
