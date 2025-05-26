import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { environment } from 'src/environments/environment.development';
import {catchError, EMPTY, Observable, of, throwError} from "rxjs";
import {Card, CardListModel} from "../../models/card/cardListModel";
import { CardDetailModel } from "../../models/card/cardDetailModel";

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private httpClient: HttpClient) {
  }

  public getAllCards(page: number, pageSize: number): Observable<CardListModel> {
    return this.httpClient.get<CardListModel>(environment.API_BASE_URL + "/cards/search?as=grid&order=name&q=(game:paper) unique:art" + "&total_cards=" + pageSize + "&page=" + page);
  }

  public getCardById(id: string): Observable<CardDetailModel> {
    return this.httpClient.get<CardDetailModel>(environment.API_BASE_URL + '/cards/' + id)
  }

  public getCardsByName(name: string, pageSize: number, page: number): Observable<CardListModel> {
    let trimmedName = name?.trim();

    if (trimmedName == null || trimmedName === "") {
      return EMPTY;
    }

    return this.httpClient.get<CardListModel>(
      `${environment.API_BASE_URL}/cards/search?order=name&q=${trimmedName}&page=${page}&unique=art&total_cards=${pageSize}`
    ).pipe(
      catchError((error) => {
        const message = error.status === 404
          ? 'No cards found with the given name.'
          : 'Failed to fetch cards.';
        return throwError(() => new Error(message));
      })
    );
  }


  public getCardsByCriterias(name: string, page: number, filters: any, inStock: boolean): Observable<CardListModel> {
    let params = new HttpParams().set('page', page);
    let trimmedName = name?.trim();
    let queryParts: string[] = [];

    if (trimmedName) queryParts.push(trimmedName);
    if (filters.color) queryParts.push(filters.color);
    if (filters.mana) queryParts.push("mv=" + filters.mana);
    if (filters.rarity) queryParts.push("r:" + filters.rarity);
    if (filters.power) queryParts.push("pow" + filters.power);
    if (filters.toughness) queryParts.push("tou" + filters.toughness);

    // Si l'utilisateur veut uniquement les cartes en stock
    if (inStock) {
      queryParts.push("game:paper");
      queryParts.push("unique:art");
      queryParts.push("order:name");
    }

    if (queryParts.length > 0) {
      const fullQuery = queryParts.join(" ");
      params = params.set('q', fullQuery);
    }

    return this.httpClient.get<CardListModel>(
      `${environment.API_BASE_URL}/cards/search`,
      {params}
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
