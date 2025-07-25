import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Order} from "../../models/order/admin-orders";

@Injectable({
  providedIn: 'root'
})
export class AdminOrdersService {
  private apiURL = 'https://fabled-project.onrender.com/api/admin';

  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiURL + '/orders');
  }
}
