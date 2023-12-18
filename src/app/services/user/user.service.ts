import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { UserCreateModel } from "../../models/user/userCreateModel";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiURL = 'http://127.0.0.1:8000/api/user';
  constructor( private httpClient: HttpClient ) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }

  public userCreate(user : UserCreateModel): Observable<UserCreateModel> {
    console.log(JSON.stringify(user));
    return this.httpClient.post<UserCreateModel>(this.apiURL + '/create', JSON.stringify(user), this.httpOptions )
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
