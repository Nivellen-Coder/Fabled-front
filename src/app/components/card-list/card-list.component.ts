import { Component, OnInit } from '@angular/core';
import { Card, cardListModel } from "../../models/card/cardListModel";
import { FormControl, FormGroup } from "@angular/forms";
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

  searchForm:FormGroup = new FormGroup({
    search:new FormControl('')
  })

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
    this.currentPage = page;

    if(this.isSearching) {
      this.cardService.getCardsByName(this.searchForm.get('search')?.value, this.pageSize, this.currentPage).subscribe((cards: cardListModel) => {
        if(!this.cards){
          this.isLoading = true;
        }
        this.cards = cards.data;
        this.total = cards.meta.total;
        this.nbPage = cards.meta.last_page;
        this.isLoading = false;
      });
    } else {
      this.loadCards();
    }

    this.viewportScroller.scrollToPosition([0, 0]);
  }
}
