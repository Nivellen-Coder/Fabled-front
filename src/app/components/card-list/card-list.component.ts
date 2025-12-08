import { Component, OnInit } from '@angular/core';
import { CardListModel, Card } from "../../models/card/cardListModel";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CardService } from "../../services/card/card.service";
import { Router } from "@angular/router";
import { NgFor, NgIf, ViewportScroller } from '@angular/common';
import {debounceTime, distinctUntilChanged, filter, forkJoin, Subscription, switchMap} from "rxjs";
import { LucideAngularModule } from "lucide-angular";
import { PaginationComponent } from "../pagination/pagination.component";
import { ToastrService } from "ngx-toastr";
import {OfferService} from "../../services/offer/offer.service";
import {ScrollToTopComponent} from "../scroll-to-top/scroll-to-top.component";

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
  imports: [
    NgIf,
    NgFor,
    LucideAngularModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationComponent,
    ScrollToTopComponent,
  ],
  standalone: true
})
export class CardListComponent implements OnInit {
  set: string = "";
  cards: Card[] = [];
  availableCardIds: string[] = [];
  currentPage: number = 1;
  nbPage: number = 1;
  pageSize: number = 175;
  divList: any[] = [];
  total: number = 0;
  isLoading: boolean = true;
  isSearching: boolean = false;
  isSearchingWithCriterias: boolean = false;
  isAccordionOpen: boolean = false;
  classesSelected: string[] = [];
  searchValue: string = "";
  searchSubscription: Subscription = new Subscription();
  color: string = "";

  searchForm:FormGroup = new FormGroup({
    search:new FormControl('')
  })

  searchByCriteriasForm:FormGroup = new FormGroup({
    color: new FormControl(''),
    mana: new FormControl(''),
    rarity: new FormControl(''),
    power: new FormControl(''),
    toughness: new FormControl(''),
    cost: new FormControl(''),
    cardType: new FormControl(''),
    inStockOnly: new FormControl(false),
  });

  constructor(private cardService: CardService, private router: Router, private toastr: ToastrService, private viewportScroller: ViewportScroller, private offerService: OfferService) {
    this.isLoading = true;
    this.performSearch(1)
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
      let index = this.cards.findIndex(element => element.id === "a505ba37-b131-48d2-a2d7-a340763343f8");
      this.cards.splice(index, 1);
      this.cards = cards.data.filter(cards => cards.image_uris && cards.id !== '');
      this.total = cards.total_cards;
      this.nbPage = Math.ceil(this.total / this.pageSize);
      this.pageSize = 175;
      this.divList = new Array(175);
      this.isLoading = false;
      this.isSearching = false;
    });
  }

  public searchForCards(page: number): void {
    const searchControl = this.searchForm.get('search');
    const inStockOnly = this.searchByCriteriasForm.get('inStockOnly')?.value;

    if (!searchControl) return;

    this.searchSubscription.unsubscribe(); // Nettoyage de l'ancien abonnement

    this.searchSubscription = searchControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((searchValue) => {
        this.cards = [];
        this.searchValue = searchValue;
        this.currentPage = 1;
        this.isSearching = true;
        this.total = 0;
        this.nbPage = 0;

        if (inStockOnly) {
          // Recherche locale dans les cartes en stock
          this.searchInStockByName(searchValue, page);
          return [];
        } else {
          return this.cardService.getCardsByName(searchValue, this.pageSize, page);
        }
      })
    ).subscribe({
      next: (result: any) => {
        if (!result?.data) return;

        this.cards = result.data;
        this.total = result.total_cards;
        this.nbPage = Math.ceil(this.total / this.pageSize);
        this.isSearching = true;
      },
      error: () => {
        this.toastr.error('Erreur lors de la recherche.');
        this.cards = [];
        this.isSearching = false;
      }
    });
  }


  changePage(page: number): void {
    this.performSearch(page);

    this.viewportScroller.scrollToPosition([0, 0]);
  }

  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  searchByCriterias(page: number) {
    // Récupérer les classes sélectionnées (hors champs spécifiques)
    this.classesSelected = Object.keys(this.searchByCriteriasForm.value || {})
      .filter(
        key =>
          this.searchByCriteriasForm.value[key] &&
          !['mana', 'rarity', 'power', 'toughness', 'cost', 'cardType', 'inStockOnly'].includes(key)
      );

    // Extraction des valeurs du formulaire
    const mana = this.searchByCriteriasForm.get('mana')?.value;
    const rarity = this.searchByCriteriasForm.get('rarity')?.value;
    const power = this.searchByCriteriasForm.get('power')?.value;
    const toughness = this.searchByCriteriasForm.get('toughness')?.value;
    const criterias = this.searchByCriteriasForm.get('color')?.value;
    const inStock = this.searchByCriteriasForm.get('inStockOnly')?.value;

    // Définition de la couleur pour l'API
    switch (criterias) {
      case 'white': this.color = 'c:"{W}"'; break;
      case 'blue': this.color = 'c:"{U}"'; break;
      case 'black': this.color = 'c:"{B}"'; break;
      case 'red': this.color = 'c:"{R}"'; break;
      case 'green': this.color = 'c:"{G}"'; break;
      case 'colorless': this.color = 'c:colorless'; break;
    }

    // Construction des filtres
    const filters: any = {};
    if (mana) filters.mana = 'mv=' + mana;
    if (rarity) filters.rarity = 'r:' + rarity;
    if (power) filters.power = 'pow' + power;
    if (toughness) filters.toughness = 'tou' + toughness;
    if (this.color) filters.color = this.color;

    const cardRequest$ = this.cardService.getCardsByCriterias(this.searchValue, page, filters, inStock);

    // Si on filtre uniquement les cartes en stock
    if (inStock) {
      this.cards = [];
      this.offerService.getAvailableCardIds().subscribe({
        next: (ids) => {
          this.availableCardIds = ids;

          const requests = ids.map(id => this.cardService.getCardById(id));

          forkJoin(requests).subscribe({
            next: (allCards) => {
              const filtered = allCards.filter(card =>
                card.name.toLowerCase().includes(this.searchValue.toLowerCase())
              );

              this.total = filtered.length;
              this.nbPage = Math.ceil(this.total / this.pageSize);
              this.cards = this.paginateArray(filtered, this.pageSize, page);
              this.currentPage = page;
              this.isSearching = true;
              this.isSearchingWithCriterias = true;
              this.isLoading = false;
            },
            error: (err) => {
              console.error("Erreur lors de la récupération des cartes :", err);
              this.toastr.error("Erreur de chargement des cartes en stock.");
              this.isLoading = false;
            }
          });
        },
        error: (err) => {
          console.error("Erreur lors de la récupération des IDs disponibles :", err);
          this.isLoading = false;
        }
      });
    } else if(inStock && this.searchValue) {
      this.cards = [];
      this.searchInStockByName(this.searchValue, 1);
    } else if(inStock && filters) {
      this.cards = [];
      this.cardService.getCardsByCriterias(this.searchValue, page, filters, inStock).subscribe((data) => {
        this.cards = data.data;
      });
    }
  }


  private searchInStockByName(searchValue: string, page: number) {
    this.isLoading = true;
    this.cards = [];

    this.offerService.getAvailableCardIds().subscribe({
      next: (ids) => {
        this.availableCardIds = ids;

        // Chargement de toutes les cartes disponibles
        const requests = ids.map(id => this.cardService.getCardById(id));

        forkJoin(requests).subscribe({
          next: (allCards) => {
            // Filtrage local par nom (insensible à la casse)
            const filtered = allCards.filter(card =>
              card.name.toLowerCase().includes(searchValue.toLowerCase())
            );

            this.total = filtered.length;
            this.nbPage = Math.ceil(this.total / this.pageSize);

            // Paginer les cartes filtrées
            const cardsPage = this.paginateArray(filtered, this.pageSize, page);
            this.cards = cardsPage;
            this.currentPage = page;
            this.isSearching = true;
            this.isSearchingWithCriterias = true;
            this.isLoading = false;
          },
          error: (err) => {
            console.error("Erreur lors de la récupération des cartes :", err);
            this.toastr.error("Erreur de chargement des cartes en stock.");
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des IDs :", err);
        this.toastr.error("Erreur de récupération du stock.");
        this.isLoading = false;
      }
    });
  }

  private paginateArray<T>(array: T[], pageSize: number, pageNumber: number): T[] {
    const startIndex = (pageNumber - 1) * pageSize;
    return array.slice(startIndex, startIndex + pageSize);
  }

  public performSearch(page: number): void {
    const searchValue = this.searchForm.get('search')?.value || '';
    const inStock = this.searchByCriteriasForm.get('inStockOnly')?.value;
    const filters = this.getSearchFilters();

    const hasFilters = Object.keys(filters).length > 0;
    const hasSearch = searchValue.trim().length > 0;

    this.searchValue = searchValue;
    this.currentPage = page;
    this.cards = [];
    this.total = 0;
    this.nbPage = 0;
    this.isSearching = true;
    this.isLoading = true;

    if (inStock && !hasSearch && !hasFilters) {
      // Cas 7
      this.searchInStockByName('', page);
    } else if (inStock && hasSearch && !hasFilters) {
      // Cas 2
      this.searchInStockByName(searchValue, page);
    } else if (inStock && (hasSearch || hasFilters)) {
      // Cas 4 et 6
      this.searchInStockWithFilters(filters, searchValue, page);
    } else if (!inStock && hasFilters) {
      // Cas 3 et 5
      this.searchViaService(filters, searchValue, page);
    } else if (!inStock && hasSearch) {
      // Cas 1
      this.searchByName(searchValue, page);
    } else {
      // Fallback
      this.loadCards();
    }
  }

  private getSearchFilters(): any {
    const form = this.searchByCriteriasForm;
    const filters: any = {};

    const color = form.get('color')?.value;
    switch (color) {
      case 'white': filters.color = 'c:"{W}"'; break;
      case 'blue': filters.color = 'c:"{U}"'; break;
      case 'black': filters.color = 'c:"{B}"'; break;
      case 'red': filters.color = 'c:"{R}"'; break;
      case 'green': filters.color = 'c:"{G}"'; break;
      case 'colorless': filters.color = 'c:{C}'; break;
    }

    const mapFields = ['mana', 'rarity', 'power', 'toughness', 'cost', 'cardType'];
    for (const field of mapFields) {
      const value = form.get(field)?.value;
      if (value) {
        filters[field] = value;
      }
    }

    return filters;
  }

  private searchByName(searchValue: string, page: number): void {
    this.cardService.getCardsByName(searchValue, this.pageSize, page).subscribe({
      next: (result: any) => {
        this.cards = result.data;
        this.total = result.total_cards;
        this.nbPage = Math.ceil(this.total / this.pageSize);
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Erreur lors de la recherche.');
        this.cards = [];
        this.isLoading = false;
      }
    });
  }

  private searchInStockWithFilters(filters: any, searchValue: string, page: number): void {
    this.isLoading = true;
    this.cards = [];

    this.offerService.getAvailableCardIds().subscribe({
      next: (ids) => {
        if (!ids.length) {
          this.cards = [];
          this.total = 0;
          this.nbPage = 1;
          this.isLoading = false;
          return;
        }

        const requests = ids.map(id => this.cardService.getCardById(id));

        forkJoin(requests).subscribe({
          next: (allCards) => {
            // ✅ Filtrage local mais avancé avec plusieurs critères
            let filtered = allCards;

            if (searchValue) {
              filtered = filtered.filter(card =>
                card.name.toLowerCase().includes(searchValue.toLowerCase())
              );
            }

            if (filters.color) {
              let color = this.searchByCriteriasForm.get('color')?.value;
              if(color == 'blue') {
                color = color.toUpperCase().charAt(2);
              } else {
                color = color.toUpperCase().charAt(0);
              }
              filtered = filtered.filter(card => card.colors?.includes(color.toUpperCase().charAt(0)));
            }

            if (filters.mana) {
              filtered = filtered.filter(card => card.cmc == filters.mana);
            }

            if (filters.rarity) {
              filtered = filtered.filter(card => card.rarity == filters.rarity);
            }

            if (filters.toughness) {
              filtered = filtered.filter(card => card.toughness == filters.toughness.slice(1));
            }

            if (filters.power) {
              filtered = filtered.filter(card => card.power == filters.power.slice(1));
            }

            this.total = filtered.length;
            this.nbPage = Math.ceil(this.total / this.pageSize);
            this.cards = this.paginateArray(filtered, this.pageSize, page);
            this.currentPage = page;
            this.isLoading = false;
          },
          error: () => {
            this.toastr.error('Erreur lors du chargement des cartes en stock.');
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.toastr.error('Erreur lors de la récupération du stock.');
        this.isLoading = false;
      }
    });
  }

  private searchViaService(filters: any, searchValue: string, page: number): void {

    this.cardService.getCardsByCriterias(searchValue, page, filters, false).subscribe({
      next: (result) => {
        this.cards = result.data.filter(cards => cards.image_uris && cards.id !== '');
        this.total = result.total_cards;
        this.nbPage = Math.ceil(this.total / this.pageSize);
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Erreur lors de la recherche par filtres.');
        this.isLoading = false;
      }
    });
  }



}
