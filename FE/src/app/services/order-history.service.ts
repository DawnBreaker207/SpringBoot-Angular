import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OrderHistoryService {
  private orderUrl = environment.luv2shopApiUrl + '/orders';
  constructor(private httpClient: HttpClient) {}

  getOrderHistory(email: string): Observable<GetResponseOrderHistory> {
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailByDateCreatedDesc?email=$${email}`;
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }
}
interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  };
}
