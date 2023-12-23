import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { Country } from "../../models/user/userCreateModel";

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private apiURL = 'http://127.0.0.1:8000/api/country';
  constructor(private httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }

  countryList(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(this.apiURL + '/list')
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
