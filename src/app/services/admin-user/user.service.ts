import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {UserListModel} from "../../models/user/userListModel";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiURL = 'https://fabled-project.onrender.com/api/admin';

  constructor(private httpClient: HttpClient) {

  }

  userList(): Observable<UserListModel[]> {
    return this.httpClient.get<UserListModel[]>(`${this.apiURL}/users`)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteUser(id: number): Observable<HttpErrorResponse> {
    return this.httpClient.delete<HttpErrorResponse>(`${this.apiURL}/user/${id}/delete`)
      .pipe(
        catchError(this.handleError)
      );
  }

  reactivateUser(id: number): Observable<HttpErrorResponse> {
    return this.httpClient.get<HttpErrorResponse>(`${this.apiURL}/user/${id}/reactivate`)
    .pipe(
      catchError(this.handleError)
    );
  }

  updateUser(user: UserListModel, id: number|undefined): Observable<UserListModel> {
    return this.httpClient.put<UserListModel>(`${this.apiURL}/user/${id}/update`, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  anonymizeMyAccount(id: number): Observable<HttpErrorResponse> {
    return this.httpClient.get<HttpErrorResponse>(`${this.apiURL}/user/${id}/anonymize`)
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
