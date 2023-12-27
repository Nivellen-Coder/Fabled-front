import { Component } from '@angular/core';
import {Card, cardListModel} from "../../models/card/cardListModel";
import { FormControl, FormGroup } from "@angular/forms";
import {CardService} from "../../services/card/card.service";
import {Router} from "@angular/router";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs";

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent {
  cards: Card[] = [];
  currentPage: number = 1;
  nbPage: number = 1;
  pageSize: number = 48;
  divList: any[] = new Array(48);
  total: number = 2000;
  isLoading: boolean = true;

  // searchForm:FormGroup = new FormGroup({
  //   search:new FormControl('')
  // })

  constructor(private cardService: CardService, private router: Router) {
    // this.searchForm.get('search')?.valueChanges.pipe(
    //   debounceTime(1000),
    //   distinctUntilChanged(),
    //   switchMap((v) => this.cardService.getCardsByName(v, this.pageSize))
    // ).subscribe(
    //   (result) => {
    //     this.cards = result?.data;
    //     this.currentPage = 1; // Réinitialise la page à 1 lors de la recherche
    //     this.nbPage = result?.meta?.last_page || 1; // Met à jour le nombre de pages
    //     this.total = result?.meta?.total || 0; // Met à jour le nombre total d'éléments
    //   }
    // );
  }

  ngOnInit(){
    this.loadCards();
    this.isLoading = true;
  }

  // cardDetail(id: string) {
  //   this.router.navigate(['card-detail', id]);
  // }

  public loadCards(): void {
    this.cardService.getAllCards(this.currentPage, this.pageSize).subscribe((cards: cardListModel) => {
      if(!this.cards){
        this.isLoading = true;
      }
      this.cards = cards.data;
      this.total = cards.meta?.total;
      this.nbPage = cards.meta?.last_page;
      this.isLoading = false;
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadCards();
  }
}
