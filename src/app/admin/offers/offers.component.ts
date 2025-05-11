import {Component, OnInit} from '@angular/core';
import { AdminOfferListModel } from "../../models/offer/adminOfferListModel";
import { AdminOfferService } from "../../services/admin-offer/admin-offer.service";
import { Router } from "@angular/router";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {CardDetailModel} from "../../models/card/cardDetailModel";
import {CardService} from "../../services/card/card.service";
import {ToastrService} from "ngx-toastr";
import {LucideAngularModule} from "lucide-angular";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    DatePipe,
    LucideAngularModule,
    NgIf,
    FormsModule
  ],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.scss'
})
export class OffersComponent implements OnInit {
  offers: AdminOfferListModel[] = [];
  selectedOffer: AdminOfferListModel | null = null;
  filteredOffers: any[] = [];   // données filtrées
  paginatedOffers: any[] = [];  // données affichées paginées
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchUsername: string = '';

  constructor(
    private offerService: AdminOfferService,
    private cardService: CardService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  updatePaginatedOffers(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOffers.slice(start, start + this.itemsPerPage);
  }

  filterOffers(): void {
    const term = this.searchUsername.toLowerCase().trim();

    this.filteredOffers = this.offers.filter(offer =>
      offer.userOfferId?.username?.toLowerCase().includes(term)
    );

    this.currentPage = 1;
    this.updatePaginatedOffers();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOffers.length / this.itemsPerPage);
  }

  loadOffers(): void {
    this.offerService.offerList().subscribe((data) => {
      this.offers = data;
      this.filteredOffers = data;
      for (let o of this.offers) {
        this.cardService.getCardById(o.cardIdentifier).subscribe((data: CardDetailModel) => {
          o.cardName = data.name;
        });
      }
      for (let o of this.filteredOffers) {
        this.cardService.getCardById(o.cardIdentifier).subscribe((data: CardDetailModel) => {
          o.cardName = data.name;
        });
      }
    })
  }

  deleteOffer(id: number): void {
    if (confirm('Are you sure you want to delete this offer ?')) {
      this.offerService.deleteOffer(id).subscribe(({
        next: () => {
          this.toastr.success("Offer successfully deleted.");
          this.loadOffers();
        },
        error: (err) => {
          this.toastr.error(err.error.message || 'Failed to delete user');
          console.error("Delete Error:", err);
        }
      }));
    }
  }

  cardDetail(id: string) {
    this.router.navigate(['card-detail', id]);
  }

  editOffer(offer: AdminOfferListModel) {
    // Clonage pour ne pas modifier directement la liste
    this.selectedOffer = { ...offer };
  }

  toggleOfferStatus(offer: AdminOfferListModel) {
    const updated = { ...offer, isActive: !offer.isActive };
    this.offerService.updateOffer(updated.id, updated).subscribe(() => {
      this.loadOffers();
    });
  }

  updateOffer() {
    if (this.selectedOffer) {
      this.offerService.updateOffer(this.selectedOffer.id, this.selectedOffer).subscribe(() => {
        this.loadOffers();
        this.selectedOffer = null;
        this.filterOffers(); // au cas où il y a un filtre actif
      });
    }
  }
}
