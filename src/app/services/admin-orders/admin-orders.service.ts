import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Order} from "../../models/order/admin-orders";

@Injectable({
  providedIn: 'root'
})
export class AdminOrdersService {
  private apiURL = 'http://127.0.0.1:8000/api/admin';

  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiURL + '/orders');
  }
}
