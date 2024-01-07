import { Injectable } from '@angular/core';
import { offerCreateModel } from '../../models/offer/offerCreateModel';
import { catchError, Observable, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { offerListByCardModel } from "../../models/offer/offerListByCardModel";

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  // @ts-ignore
  bearerToken = JSON.parse(localStorage.getItem('jwt'));
  private apiURL = 'http://127.0.0.1:8000/api/offer';
  constructor(private httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.bearerToken.token}`
    })
  }
  public offerCreate(offer : offerCreateModel, id: string, userId: number): Observable<offerCreateModel> {
    return this.httpClient.post<offerCreateModel>(this.apiURL + '/create/' + id + '/' + userId, JSON.stringify(offer), this.httpOptions )
      .pipe(
        catchError(this.handleError)
      );
  }

  public offerListByCardId(cardId: string): Observable<offerListByCardModel> {
    return this.httpClient.get<offerListByCardModel>(this.apiURL + '/list/' + cardId)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      console.error('An error occurred:', error.error.message);
    } else {
      // Erreur côté serveur
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Renvoie une observable avec un message d'erreur convivial pour l'utilisateur
    return throwError(() => error);
  }
}
