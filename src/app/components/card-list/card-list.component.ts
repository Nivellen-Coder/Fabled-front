import { Component, OnInit } from '@angular/core';
import { CardListModel, Card } from "../../models/card/cardListModel";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CardService } from "../../services/card/card.service";
import { Router } from "@angular/router";
import { NgFor, NgIf, ViewportScroller } from '@angular/common';
import {debounceTime, distinctUntilChanged, forkJoin, Subscription, switchMap} from "rxjs";
import { LucideAngularModule } from "lucide-angular";
import { PaginationComponent } from "../pagination/pagination.component";
import { ToastrService } from "ngx-toastr";
import {OfferService} from "../../services/offer/offer.service";

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
    this.searchForCards(1);
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
      console.log(this.cards);
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
    this.currentPage = page;

    if (this.isSearching && !this.isSearchingWithCriterias) {
      this.searchForCards(page);
    } else if (this.isSearchingWithCriterias && this.isSearching) {
      this.searchByCriterias(page);
    } else {
      this.loadCards();
    }

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
    const cost = this.searchByCriteriasForm.get('cost')?.value;
    const cardType = this.searchByCriteriasForm.get('cardType')?.value;
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

    console.log("Criterias: ", criterias);

    // Construction des filtres
    const filters: any = {};
    if (mana) filters.mana = 'mv=' + mana;
    if (rarity) filters.rarity = 'r:' + rarity;
    if (power) filters.power = 'pow' + power;
    if (toughness) filters.toughness = 'tou' + toughness;
    if (cost) filters.cost = cost;
    if (cardType) filters.cardType = cardType;
    if (this.color) filters.color = this.color;

    const cardRequest$ = this.cardService.getCardsByCriterias(this.searchValue, page, filters, inStock);

    // Si on filtre uniquement les cartes en stock
    if (inStock) {
      this.cards = [];
      const offerRequest$ = this.offerService.getAvailableCardIds();

      forkJoin([cardRequest$, offerRequest$]).subscribe({
        next: ([cardData, availableIds]) => {
          this.cards = (cardData.data || []).filter(card => availableIds.includes(card.id));
          this.total = this.cards.length;
          this.pageSize = 175;
          this.nbPage = Math.ceil(this.total / this.pageSize);
          this.isSearching = true;
          this.isSearchingWithCriterias = true;
          this.isLoading = false;
          console.log(this.cards);
        },
        error: (err) => {
          console.error("Erreur lors du chargement des cartes avec filtres et offres :", err);
          this.isLoading = false;
        }
      });
    } else {
      // Recherche normale sans contrainte d'inventaire
      cardRequest$.subscribe({
        next: (cards) => {
          this.cards = cards.data || [];
          this.total = cards.total_cards;
          this.pageSize = 175;
          this.nbPage = Math.ceil(this.total / this.pageSize);
          this.isSearching = true;
          this.isSearchingWithCriterias = true;
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Erreur lors du chargement des cartes avec filtres :", err);
          this.isLoading = false;
        }
      });
    }

    // Cas spécial : recherche vide mais stock activé (affichage de toutes les cartes dispo)
    if (
      inStock &&
      !criterias &&
      !mana &&
      !rarity &&
      !power &&
      !toughness &&
      !cost &&
      !cardType
    ) {
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
}
