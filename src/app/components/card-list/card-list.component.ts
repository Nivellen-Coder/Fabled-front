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
      this.total = cards.total_cards;
      this.nbPage = Math.ceil(this.total / this.pageSize);
      this.pageSize = 175;
      console.log(this.cards);
      this.divList = new Array(175);
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
          this.currentPage = 1;
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
            this.total = result.total_cards;
            this.nbPage = Math.ceil(this.total / this.pageSize);
          } else {
            // Aucun résultat trouvé
            this.cards = [];
            this.toastr.info('No cards found matching your search criteria. Try again.');
          }
        },
      });
      this.isSearching = false;
    }
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
    this.classesSelected = Object.keys(this.searchByCriteriasForm.value || {})
      .filter(key => this.searchByCriteriasForm.value[key]
        && !['mana', 'rarity', 'power', 'toughness', 'cost', 'cardType'].includes(key)
      );

    const mana = this.searchByCriteriasForm.get('mana')?.value;
    const rarity = this.searchByCriteriasForm.get('rarity')?.value;
    const power = this.searchByCriteriasForm.get('power')?.value;
    const toughness = this.searchByCriteriasForm.get('toughness')?.value;
    const cost = this.searchByCriteriasForm.get('cost')?.value;
    const cardType = this.searchByCriteriasForm.get('cardType')?.value;
    const criterias = this.searchByCriteriasForm.get('color')?.value;

    if (criterias === "white") {
      this.color = 'c:"{W}"';
    }

    if (criterias === "blue") {
      this.color = 'c:"{U}"';
    }

    if (criterias === "black") {
      this.color = 'c:"{B}"';
    }

    if (criterias === "red") {
      this.color = 'c:"{R}"';
    }

    if (criterias === "green") {
      this.color = 'c:"{G}"';
    }

    if (criterias === "colorless") {
      this.color = 'c:colorless';
    }

    console.log("Criterias: ", criterias);

    const filters: any = {};
    if (mana) filters.mana = 'mv=' + mana;
    if (rarity) filters.rarity = 'r:' + rarity;
    if (power) filters.power = 'pow' + power;
    if (toughness) filters.toughness = 'tou' + toughness;
    if (cost) filters.cost = cost;
    if (cardType) filters.cardType = cardType;
    if (this.color) filters.color = this.color;

    this.isLoading = true;

    this.cardService.getCardsByCriterias(this.searchValue, page, filters).subscribe((cards: CardListModel) => {
      this.cards = cards.data || [];
      this.total = cards.total_cards;
      this.pageSize = 175;
      this.nbPage =  Math.ceil(this.total / this.pageSize);
      this.isSearchingWithCriterias = true;
      this.isSearching = true;
      this.isLoading = false;
      this.currentPage = page;
      console.log(this.cards);
    });
  }

  private fetchCardsByName(page: number): void {
    let trimmedSearchValue = this.searchForm.get('search')?.value; // Supprime les espaces inutiles

    console.log("Valeur de searchValue :", `"${trimmedSearchValue}"`);

    if (!trimmedSearchValue) {
      console.log("Aucune valeur de recherche -> On ne fait pas d'appel API.");
      this.cards = []; // Réinitialise les résultats
      this.total = 0;
      this.nbPage = 0;
      this.isSearching = false;
      return; // Arrête la méthode pour éviter l'appel API
    }

    this.cardService.getCardsByName(trimmedSearchValue, this.pageSize, page)
      .subscribe({
        next: (cards: CardListModel) => {
          this.updateCardList(cards, 175);
          this.isSearching = true;
          this.isSearchingWithCriterias = false;
        },
        error: (error) => {
          console.error("Erreur API : ", error);
          this.isSearching = false;
        }
      });
  }

  // private fetchCardsByCriterias(page: number): void {
  //   this.classesSelected = Object.keys(this.searchByCriteriasForm.value || {})
  //     .filter(key => this.searchByCriteriasForm.value[key]
  //       && !['talent', 'rarity', 'setType', 'pitch', 'cost', 'cardType'].includes(key)
  //     );
  //
  //   const talent = this.searchByCriteriasForm.get('talent')?.value;
  //   const rarity = this.searchByCriteriasForm.get('rarity')?.value;
  //   const set = this.searchByCriteriasForm.get('setType')?.value;
  //   const pitch = this.searchByCriteriasForm.get('pitch')?.value;
  //   const cost = this.searchByCriteriasForm.get('cost')?.value;
  //   const cardType = this.searchByCriteriasForm.get('cardType')?.value;
  //   const criterias = this.searchByCriteriasForm.get('color')?.value;
  //
  //   if (criterias === "white") {
  //     this.color = 'o:"{W}"';
  //   }
  //
  //   console.log("Criterias: ", criterias);
  //
  //   const filters: any = {};
  //   if (talent) filters.talent = talent;
  //   if (rarity) filters.rarity = rarity;
  //   if (set) filters.set = set;
  //   if (pitch) filters.pitch = pitch;
  //   if (cost) filters.cost = cost;
  //   if (cardType) filters.cardType = cardType;
  //   if (this.color) filters.white = this.color;
  //
  //   this.cardService.getCardsByCriterias(this.searchValue, page, filters).subscribe((cards: CardListModel) => {
  //     this.updateCardList(cards, 48);
  //     this.isSearchingWithCriterias = true;
  //   });
  // }

  // private fetchAllCards(page: number): void {
  //   this.cardService.getAllCards(page, this.pageSize).subscribe((cards: CardListModel) => {
  //     this.updateCardList(cards, 50);
  //   });
  // }

  private updateCardList(cards: CardListModel, pageSize: number): void {
    this.isLoading = true;
    this.cards = cards.data;
    this.total = cards.total_cards;
    this.pageSize = pageSize;
    this.nbPage = Math.ceil(this.total / this.pageSize); // Calcul du nombre de pages
    this.isLoading = false;
  }
}
