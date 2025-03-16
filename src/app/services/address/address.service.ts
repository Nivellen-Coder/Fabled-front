import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { Address } from "../../models/user/userInfosModel";

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private apiURL = 'http://localhost:8000/api/address';

  constructor(private httpClient: HttpClient) { }

  createAddress(id: string|null, data: Address): Observable<any> {
    return this.httpClient.post<Address>(`${this.apiURL}/create/${id}`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateAddress(id: string|null, data: Address): Observable<any> {
    return this.httpClient.put<Address>(`${this.apiURL}/profile/${id}/edit`, data)
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
