import { Component, OnInit } from '@angular/core';
import { CardDetailModel } from "../../models/card/cardDetailModel";
import { CardService } from "../../services/card/card.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent implements OnInit {
  private cardId: string = "";
  card: CardDetailModel = {} as CardDetailModel;
  isLoading: boolean = true;

  constructor(private cardService: CardService, private actRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.cardId = this.actRoute.snapshot.params['id'];
    this.cardService.getCardById(this.cardId).subscribe((data: CardDetailModel) => {
      if(!this.card){
        this.isLoading = true;
      }
      this.card = data;
      this.isLoading = false;
    });
  }
}
