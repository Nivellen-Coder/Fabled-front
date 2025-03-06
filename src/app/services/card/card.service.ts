import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { environment } from 'src/environments/environment.development';
import {catchError, EMPTY, Observable, of, throwError} from "rxjs";
import { CardListModel } from "../../models/card/cardListModel";
import { CardDetailModel } from "../../models/card/cardDetailModel";

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private httpClient: HttpClient) { }

  public getAllCards(page: number, pageSize: number): Observable<CardListModel>{
    return this.httpClient.get<CardListModel>(environment.API_BASE_URL + "/cards/search?as=grid&order=name&q=%28game%3Apaper%29" + "&total_cards=" + pageSize + "&page=" + page);
  }

  public getCardById(id: string): Observable<CardDetailModel>{
    return this.httpClient.get<CardDetailModel>(environment.API_BASE_URL + '/cards/' + id)
  }

  public getCardsByName(name: string, pageSize: number, page: number): Observable<CardListModel> {
    let trimmedName = name?.trim();

    if(trimmedName == null || trimmedName === "") {
      return EMPTY;
    }

    return this.httpClient.get<CardListModel>(
      `${environment.API_BASE_URL}/cards/search?order=edhrec&q=${trimmedName}&page=${page}&unique=prints&total_cards=${pageSize}`
    ).pipe(
      catchError((error) => {
        const message = error.status === 404
          ? 'No cards found with the given name.'
          : 'Failed to fetch cards.';
        return throwError(() => new Error(message));
      })
    );
  }


  public getCardsByCriterias(name: string, page: number, filters: any): Observable<CardListModel>{
    let params = new HttpParams().set('page', page);
    let trimmedName = name?.trim();

    if (filters.color) params = params.set('q', (trimmedName ? trimmedName + " " : "") + filters.color);
    if (filters.mana) params = params.set('q', (trimmedName ? trimmedName + " " : "") + (filters.color ? filters.color + " " : "") + filters.mana);
    if (filters.rarity) params = params.set('q', (trimmedName ? trimmedName + " " : "") + (filters.color ? filters.color + " " : "") + (filters.mana ? filters.mana + " " : "") + filters.rarity);
    if (filters.power) params = params.set('q', (trimmedName ? trimmedName + " " : "") + (filters.color ? filters.color + " " : "") + (filters.mana ? filters.mana + " " : "") + (filters.rarity ? filters.rarity + " " : "") + filters.power);
    if (filters.toughness) params = params.set('q', (trimmedName ? trimmedName + " " : "") + (filters.color ? filters.color + " " : "") + (filters.mana ? filters.mana + " " : "") + (filters.rarity ? filters.rarity + " " : "") + (filters.power ? filters.power + " " : "") + filters.toughness);
    // if (filters.cost) params = params.set('cost', filters.cost);
    // if (filters.cardType) params = params.set('cardType', filters.cardType);

    return this.httpClient.get<CardListModel>(
      `${environment.API_BASE_URL}/cards/search`,
      { params }
    ).pipe(
      catchError((error) => {
        if (error.status === 404 || error.status === 400) {
          console.warn('No cards found, returning an empty list.');
          return of({data: [], total_cards: 0} as unknown as CardListModel);
        }
        return throwError(() => new Error('Failed to fetch cards.'));
      })
    );
  }
}
