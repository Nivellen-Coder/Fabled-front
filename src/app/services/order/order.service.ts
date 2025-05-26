import { Injectable } from '@angular/core';
import {catchError, Observable, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { Order } from "../../models/order/order";
import {UserSalesModel} from "../../models/user/userSalesModel";

@Injectable({
  providedIn: 'root'
})

export class OrderService {
  private apiURL = 'http://localhost:8000/api/orders';

  constructor(private http: HttpClient) { }

  getOrdersByCurrentUser(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiURL);
  }

  getSalesByCurrentUser(): Observable<UserSalesModel[]> {
    return this.http.get<UserSalesModel[]>(this.apiURL + '/offers')
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
