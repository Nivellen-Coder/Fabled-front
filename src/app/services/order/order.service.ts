import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Order } from "../../models/order/order";

@Injectable({
  providedIn: 'root'
})

export class OrderService {
  private apiURL = 'http://localhost:8000/api/orders';

  constructor(private http: HttpClient) { }

  getOrdersByCurrentUser(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiURL);
  }
}
