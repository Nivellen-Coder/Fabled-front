import { Component, OnInit } from '@angular/core';
import { Card, cardListModel } from "../../models/card/cardListModel";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { CardService } from "../../services/card/card.service";
import { Router } from "@angular/router";
import { ViewportScroller } from '@angular/common';
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs";

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
    this.searchForm.get('search')?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((v) => this.cardService.getCardsByName(v, this.pageSize, page))
    ).subscribe(
      (result) => {
        this.cards = result?.data;
        this.nbPage = result?.meta?.last_page || 1; // Met à jour le nombre de pages
        this.total = result?.meta?.total || 0; // Met à jour le nombre total d'éléments
        this.isSearching = true;
        this.currentPage = 1;
      }
    );
  }

  changePage(page: number): void {
    if(this.isSearching && !this.isSearchingWithCriterias) {
      this.cardService.getCardsByName(this.searchForm.get('search')?.value, this.pageSize, page).subscribe((cards: cardListModel) => {
        if (!this.cards) {
          this.isLoading = true;
        }
        this.cards = cards.data;
        this.total = cards.meta.total;
        this.nbPage = cards.meta.last_page;
        this.pageSize = 48;
        this.isLoading = false;
        this.isSearching = true;
      });
    } else if(this.isSearchingWithCriterias && this.isSearching) {
      this.cardService.getCardsByCriterias(this.searchForm.get('search')?.value, page, this.classesSelected.join(',')).subscribe((cards: cardListModel) => {
        this.cards = cards.data;
        this.total = cards.meta.total;
        this.nbPage = cards.meta.last_page;
        this.pageSize = 25;
        this.isSearchingWithCriterias = true;
      });
    } else {
      this.cardService.getAllCards(page, this.pageSize).subscribe((cards: cardListModel) => {
        if(!this.cards){
          this.isLoading = true;
        }
        this.cards = cards.data;
        this.total = cards.meta?.total;
        this.nbPage = cards.meta?.last_page;
        this.pageSize = 48;
        this.isLoading = false;
      });

    }
    this.currentPage = page;
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  searchByCriterias() {
    const selectedValues = this.searchByCriteriasForm.getRawValue();
    this.classesSelected = Object.keys(this.searchByCriteriasForm.value).filter(key => this.searchByCriteriasForm.value[key]);
    this.cardService.getCardsByCriterias(this.searchForm.get('search')?.value, this.currentPage, this.classesSelected.join(',')).subscribe((cards: cardListModel) => {
      this.cards = cards.data;
      this.total = cards.meta.total;
      this.nbPage = cards.meta.last_page;
      this.pageSize = 25;
      this.isSearchingWithCriterias = true;
      console.log(this.total);
    });
  }
}
