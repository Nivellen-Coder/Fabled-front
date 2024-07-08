import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { UserCreateModel } from "../../models/user/userCreateModel";
import {UserInfosModel} from "../../models/user/userInfosModel";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiURL = 'http://localhost:8000/api/user';

  constructor(private httpClient: HttpClient) {
    this.updateHttpOptions();
  }

  // @ts-ignore
  private bearerToken = JSON.parse(localStorage.getItem('jwt'));
  private httpOptions: any;

  private updateHttpOptions(): void {
    this.bearerToken = localStorage.getItem('jwt');
    this.httpOptions = {
      headers: this.bearerToken ? new HttpHeaders({
        'Authorization': `Bearer ${this.bearerToken}`,
        'Content-Type': 'application/json'
      }) : new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }



  public userCreate(user : UserCreateModel): Observable<UserCreateModel> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post<UserCreateModel>(`${this.apiURL}` + "/create", JSON.stringify(user), { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  public userProfile(username: string): Observable<UserInfosModel> {
    // @ts-ignore
    return this.httpClient.get<UserInfosModel>(`${this.apiURL}/profile/` + username, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  public usernameById(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.apiURL}` + "/profile/" + id, this.httpOptions)
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
