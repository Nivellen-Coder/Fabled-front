import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment.development';
import { Observable } from "rxjs";
import { cardListModel } from "../../models/card/cardListModel";
import { CardDetailModel } from "../../models/card/cardDetailModel";

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${environment.BEARER_TOKEN}`
    })
  };

  constructor(private httpClient: HttpClient) { }

  public getAllCards(page: number, pageSize: number): Observable<cardListModel>{
    return this.httpClient.get<cardListModel>(environment.API_BASE_URL + "cards?time=" + Date.now() + "&hash=" + environment.API_HASH + "&per_page=" + pageSize + "&page=" + page, this.httpOptions);
  }

  public getCardById(id: string): Observable<CardDetailModel>{
    return this.httpClient.get<CardDetailModel>(environment.API_BASE_URL + 'cards/' + id + "?time=" + Date.now() + "&hash=" + environment.API_HASH, this.httpOptions)
  }

  public getCardsByName(name: string, pageSize: number): Observable<cardListModel>{
    return this.httpClient.get<cardListModel>(environment.API_BASE_URL + "cards?time=" + Date.now() + "&hash=" + environment.API_HASH + '&keywords=' + name + "&per_page=" + pageSize, this.httpOptions)
  }
}
