import { Component, OnInit } from '@angular/core';
import { CardListModel, Card } from "../../models/card/cardListModel";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CardService } from "../../services/card/card.service";
import { Router, RouterLink } from "@angular/router";
import { NgFor, NgIf, NgOptimizedImage, ViewportScroller } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subscription, switchMap } from "rxjs";
import { LucideAngularModule } from "lucide-angular";
import { PaginationComponent } from "../pagination/pagination.component";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
  imports: [
    NgIf,
    NgFor,
    NgOptimizedImage,
    LucideAngularModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    PaginationComponent,
  ],
  standalone: true
})
export class CardListComponent implements OnInit {
  set: string = "";
  cards: Card[] = [];
  currentPage: number = 1;
  nbPage: number = 1;
  pageSize: number = 50;
  divList: any[] = [];
  total: number = 50;
  isLoading: boolean = true;
  isSearching: boolean = false;
  isSearchingWithCriterias: boolean = false;
  isAccordionOpen: boolean = false;
  classesSelected: string[] = [];
  searchValue: string = "";
  searchSubscription: Subscription = new Subscription();

  searchForm:FormGroup = new FormGroup({
    search:new FormControl('')
  })

  searchByCriteriasForm:FormGroup = new FormGroup({
    none: new FormControl(''),
    generic: new FormControl(''),
    assassin: new FormControl(''),
    bard: new FormControl(''),
    brute: new FormControl(''),
    guardian: new FormControl(''),
    illusionist: new FormControl(''),
    mechanologist: new FormControl(''),
    merchant: new FormControl(''),
    ninja: new FormControl(''),
    ranger: new FormControl(''),
    runeblade: new FormControl(''),
    shapeshifter: new FormControl(''),
    warrior: new FormControl(''),
    wizard: new FormControl(''),
    talent: new FormControl(''),
    rarity: new FormControl(''),
    setType: new FormControl(''),
    pitch: new FormControl(''),
    cost: new FormControl(''),
    cardType: new FormControl(''),
  });

  constructor(private cardService: CardService, private router: Router, private toastr: ToastrService, private viewportScroller: ViewportScroller) {
    this.searchForCards(1);
    this.isLoading = true;
  }

  ngOnInit(){
    this.isLoading = true;
    this.loadCards();
  }

  cardDetail(id: string) {
    this.router.navigate(['card-detail', id]);
  }

  public loadCards(): void {
    this.cardService.getAllCards(this.currentPage, this.pageSize).subscribe((cards: CardListModel) => {
      this.isLoading = true;
      this.cards = cards.data;
      this.total = this.cards.length;
      this.nbPage = Math.round(this.cards.length / 50);
      this.pageSize = 50;
      console.log(this.cards);
      this.divList = new Array(50);
      this.isLoading = false;
      this.isSearching = false;
    });
  }

  public searchForCards(page: number): void {
    const searchControl = this.searchForm.get('search');

    if (searchControl) {
      // Abonnement à la recherche réactive
      this.searchSubscription = searchControl.valueChanges.pipe(
        debounceTime(1000), // Réduit les appels multiples
        distinctUntilChanged(), // Se déclenche seulement si la valeur change
        switchMap((searchValue) => {
          // Réinitialiser les résultats actuels avant chaque recherche
          this.cards = [];
          this.searchValue = searchValue;
          this.isSearching = true;
          this.total = 0;
          this.nbPage = 0;
          return this.cardService.getCardsByName(searchValue, this.pageSize, page);
        })
      ).subscribe({
        next: (result) => {
          // Si des résultats sont trouvés
          if (result?.data && result.data.length > 0) {
            this.cards = result.data;
            this.total = this.cards.length;
            this.nbPage = Math.ceil(this.cards.length / this.pageSize);
          } else {
            // Aucun résultat trouvé
            this.cards = [];
            this.toastr.info('No cards found matching your search criteria. Try again.');
          }
          this.isSearching = false; // Terminé
        },
      });
    }
  }

  changePage(page: number): void {
    this.currentPage = page;

    if (this.isSearching && !this.isSearchingWithCriterias) {
      this.fetchCardsByName(page);
    } else if (this.isSearchingWithCriterias && this.isSearching) {
      // this.fetchCardsByCriterias(page);
    } else {
      this.fetchAllCards(page);
    }

    this.viewportScroller.scrollToPosition([0, 0]);
  }

  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  // searchByCriterias() {
  //   this.classesSelected = Object.keys(this.searchByCriteriasForm.value)
  //     .filter(key => this.searchByCriteriasForm.value[key] && key !== 'talent' && key !== 'rarity' && key !== 'setType' && key !== 'pitch' && key !== 'cost' && key !== 'cardType');
  //
  //   const talent = this.searchByCriteriasForm.get('talent')?.value;
  //   const rarity = this.searchByCriteriasForm.get('rarity')?.value;
  //   const set = this.searchByCriteriasForm.get('setType')?.value;
  //   const pitch = this.searchByCriteriasForm.get('pitch')?.value;
  //   const cost = this.searchByCriteriasForm.get('cost')?.value;
  //   const cardType = this.searchByCriteriasForm.get('cardType')?.value;
  //
  //   const criterias = this.classesSelected.join(',');
  //
  //   const filters = {
  //     talent,
  //     rarity,
  //     set,
  //     pitch,
  //     cost,
  //     cardType,
  //     classes: criterias
  //   };
  //
  //   this.cardService.getCardsByCriterias(this.searchValue, 1, filters).subscribe((cards: cardListModel) => {
  //     if (!this.cards) {
  //       this.isLoading = true;
  //     }
  //     this.cards = cards.data;
  //     this.total = cards.meta?.total;
  //     this.nbPage = cards.meta?.last_page;
  //     this.pageSize = 48;
  //     this.isSearchingWithCriterias = true;
  //     this.isSearching = true;
  //   });
  // }

  private fetchCardsByName(page: number): void {
    this.cardService.getCardsByName(this.searchValue, this.pageSize, page).subscribe((cards: CardListModel) => {
      this.updateCardList(cards, 50);
      this.isSearching = true;
      this.isSearchingWithCriterias = false;
    });
  }

  // private fetchCardsByCriterias(page: number): void {
  //   const talent = this.searchByCriteriasForm.get('talent')?.value;
  //   const rarity = this.searchByCriteriasForm.get('rarity')?.value;
  //   const set = this.searchByCriteriasForm.get('setType')?.value;
  //   const pitch = this.searchByCriteriasForm.get('pitch')?.value;
  //   const cost = this.searchByCriteriasForm.get('cost')?.value;
  //   const cardType = this.searchByCriteriasForm.get('cardType')?.value;
  //
  //   const criterias = this.classesSelected.join(',');
  //
  //   const filters = {
  //     talent,
  //     rarity,
  //     set,
  //     pitch,
  //     cost,
  //     cardType,
  //     classes: criterias
  //   };
  //   this.cardService.getCardsByCriterias(this.searchValue, page, filters).subscribe((cards: cardListModel) => {
  //     this.updateCardList(cards, 48);
  //     this.isSearchingWithCriterias = true;
  //   });
  // }

  private fetchAllCards(page: number): void {
    this.cardService.getAllCards(page, this.pageSize).subscribe((cards: CardListModel) => {
      this.updateCardList(cards, 50);
    });
  }

  private updateCardList(cards: CardListModel, pageSize: number): void {
    this.isLoading = true;
    this.cards = cards.data;
    this.nbPage = Math.ceil(this.cards.length / 50);
    this.total = this.cards.length;
    this.pageSize = pageSize;
    this.isLoading = false;
  }
}
