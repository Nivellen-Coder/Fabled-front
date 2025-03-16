import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { UserCreateModel } from "../../models/user/userCreateModel";
import { UserInfosModel } from "../../models/user/userInfosModel";
import { UserUpdateModel } from "../../models/user/userUpdateModel";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiURL = 'http://localhost:8000/api/user';

  constructor(private httpClient: HttpClient) {
  }

  public userCreate(user: UserCreateModel): Observable<UserCreateModel> {
    return this.httpClient.post<UserCreateModel>(`${this.apiURL}/create`, JSON.stringify(user), {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  public userProfile(id: string|null): Observable<UserInfosModel> {
    return this.httpClient.get<UserInfosModel>(`${this.apiURL}/profile/` + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  public userOffersById(id: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiURL}/profile/offer/` + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateProfile(id: string|null, data: any): Observable<any> {
    return this.httpClient.put<UserUpdateModel>(`${this.apiURL}/profile/${id}/edit`, data)
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
