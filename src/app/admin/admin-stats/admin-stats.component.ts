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
    totalUsers: 1345,
    totalOffers: 3280,
    sales: 487,
    revenue: 12987.50
  };
  constructor(private httpClient: HttpClient, private router: Router) { }

  ngOnInit() {
    this.httpClient.get<any>('http://localhost:8000/api/admin/stats').subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => {
        console.error('Erreur récupération stats admin', err);
      }
    });
  }
}
