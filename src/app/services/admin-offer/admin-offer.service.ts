import { Injectable } from '@angular/core';
import {catchError, Observable, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {AdminOfferListModel} from "../../models/offer/adminOfferListModel";

@Injectable({
  providedIn: 'root'
})
export class AdminOfferService {

  private apiURL = 'https://fabled-project.onrender.com/api/admin';

  constructor(private httpClient: HttpClient) { }

  offerList(): Observable<AdminOfferListModel[]> {
    return this.httpClient.get<AdminOfferListModel[]>(`${this.apiURL}/offers`)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteOffer(id: number): Observable<HttpErrorResponse> {
    return this.httpClient.delete<HttpErrorResponse>(`${this.apiURL}/offer/${id}/delete`)
      .pipe(
        catchError(this.handleError)
      );
  }

  reactivateOffer(id: number): Observable<any> {
    return this.httpClient.get<void>(`${this.apiURL}/offer/${id}/reactivate`)
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
