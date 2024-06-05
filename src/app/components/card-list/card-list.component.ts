import { Component, OnInit } from '@angular/core';
import { Card, cardListModel } from "../../models/card/cardListModel";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { CardService } from "../../services/card/card.service";
import { Router } from "@angular/router";
import { ViewportScroller } from '@angular/common';
import {debounceTime, distinctUntilChanged, Subscription, switchMap} from "rxjs";

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit {
  cards: Card[] = [];
  currentPage: number = 1;
  nbPage: number = 1;
  pageSize: number = 48;
  divList: any[] = new Array(48);
  total: number = 2000;
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
    wizard: new FormControl('')
  });

  constructor(private cardService: CardService, private router: Router, private viewportScroller: ViewportScroller) {
    this.searchForCards(1);
    this.isLoading = true;
  }

  ngOnInit(){
    this.loadCards();
    this.isLoading = true;
  }

  cardDetail(id: string) {
    this.router.navigate(['card-detail', id]);
  }

  public loadCards(): void {
    this.cardService.getAllCards(this.currentPage, this.pageSize).subscribe((cards: cardListModel) => {
      if(!this.cards){
        this.isLoading = true;
      }
      this.cards = cards.data;
      this.total = cards.meta?.total;
      this.nbPage = cards.meta?.last_page;
      this.isLoading = false;
      this.isSearching = false;
    });
  }

  public searchForCards(page: number): void {
    const searchControl = this.searchForm.get('search');

    if (searchControl) {
      // Désabonnez-vous des abonnements précédents pour éviter les abonnements multiples
      if (this.searchSubscription) {
        this.searchSubscription.unsubscribe();
      }

      // Créez un nouvel abonnement
      this.searchSubscription = searchControl.valueChanges.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((searchValue) => {
          this.searchValue = searchValue;
          return this.cardService.getCardsByName(searchValue, this.pageSize, page);
        })
      ).subscribe(
        (result) => {
          this.cards = result?.data;
          this.nbPage = result?.meta?.last_page || 1;
          this.total = result?.meta?.total || 0;
          this.isSearching = true;
          this.currentPage = 1;
        }
      );
    }
  }

  changePage(page: number): void {
    this.currentPage = page;

    if (this.isSearching && !this.isSearchingWithCriterias) {
      this.fetchCardsByName(page);
    } else if (this.isSearchingWithCriterias && this.isSearching) {
      this.fetchCardsByCriterias(page);
    } else {
      this.fetchAllCards(page);
    }

    this.viewportScroller.scrollToPosition([0, 0]);
  }

  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  searchByCriterias() {
    this.classesSelected = Object.keys(this.searchByCriteriasForm.value).filter(key => this.searchByCriteriasForm.value[key]);

    const criterias = this.classesSelected.join(',');

    this.cardService.getCardsByCriterias(this.searchValue, 1, criterias).subscribe((cards: cardListModel) => {
      if (!this.cards) {
        this.isLoading = true;
      }
      this.cards = cards.data;
      this.total = cards.meta?.total;
      this.nbPage = cards.meta?.last_page;
      this.pageSize = 25;
      this.isSearchingWithCriterias = true;
      this.isSearching = true;
    });
  }

  private fetchCardsByName(page: number): void {
    this.cardService.getCardsByName(this.searchValue, this.pageSize, page).subscribe((cards: cardListModel) => {
      this.updateCardList(cards, 48);
      this.isSearching = true;
      this.isSearchingWithCriterias = false;
    });
  }

  private fetchCardsByCriterias(page: number): void {
    const criteria = this.classesSelected.join(',');
    this.cardService.getCardsByCriterias(this.searchValue, page, criteria).subscribe((cards: cardListModel) => {
      this.updateCardList(cards, 25);
      this.isSearchingWithCriterias = true;
    });
  }

  private fetchAllCards(page: number): void {
    this.cardService.getAllCards(page, this.pageSize).subscribe((cards: cardListModel) => {
      this.updateCardList(cards, 48);
    });
  }

  private updateCardList(cards: cardListModel, pageSize: number): void {
    if (!this.cards) {
      this.isLoading = true;
    }
    this.cards = cards.data;
    this.total = cards.meta?.total;
    this.nbPage = cards.meta?.last_page;
    this.pageSize = pageSize;
    this.isLoading = false;
  }
}
