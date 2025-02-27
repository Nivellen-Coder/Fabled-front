import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import { environment } from 'src/environments/environment.development';
import {catchError, Observable, throwError} from "rxjs";
import { CardListModel } from "../../models/card/cardListModel";
import { CardDetailModel } from "../../models/card/cardDetailModel";

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private httpOptions = {
    // headers: new HttpHeaders({
    //   'Authorization': `Bearer ${environment.BEARER_TOKEN}`
    // })
  };

  constructor(private httpClient: HttpClient) { }

  public getAllCards(page: number, pageSize: number): Observable<CardListModel>{
    return this.httpClient.get<CardListModel>(environment.API_BASE_URL + "/cards/search?as=grid&order=name&q=%28game%3Apaper%29" + "&total_cards=" + pageSize + "&page=" + page);
  }

  public getCardById(id: string): Observable<CardDetailModel>{
    return this.httpClient.get<CardDetailModel>(environment.API_BASE_URL + '/cards/' + id)
  }

  public getCardsByName(name: string, pageSize: number, page: number): Observable<CardListModel>{
    return this.httpClient.get<CardListModel>(environment.API_BASE_URL + "/cards/search?q=" + name + "&page=" + page + "&pageSize=" + pageSize)
      .pipe(
        catchError((error) => {
          // Logique pour retourner une erreur plus descriptive
          const message = error.status === 404
            ? 'No cards found with the given name.'
            : 'Failed to fetch cards.';
          return throwError(() => new Error(message));
        })
      );
  }


  // public getCardsByCriterias(name: string, page: number, filters: any): Observable<cardListModel>{
  //   let params = new HttpParams()
  //     .set('keywords', name)
  //     .set('page', page)
  //     .set('class', filters.classes)
  //     .set('talent', filters.talent)
  //     .set('rarity', filters.rarity)
  //     .set('set', filters.set)
  //     .set('pitch', filters.pitch)
  //     .set('cost', filters.cost)
  //     .set('cardType', filters.cardType);
  //
  //   const options = {
  //     headers: this.httpOptions.headers,
  //     params: params
  //   };
  //
  //   return this.httpClient.get<cardListModel>(`${environment.API_BASE_URL}cards?time=${Date.now()}`, options);
  // }
}
