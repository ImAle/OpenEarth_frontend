import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AuthService} from './auth.service';
import {environment} from '../../../environments/environment';
import {RentCreation} from '../models/rentCreation.model';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {
  baseUrl: string = environment.rootUrl + "/api/paypal";

  constructor(private http: HttpClient, private authService: AuthService) {}

  createPayment(amount: number, currency: string, description: string) {
    const url = this.baseUrl + '/createPayment';
    const token = this.authService.retrieveToken();

    const headers = {
      'Authorization': token
    };

    const body = {
      currency: currency,
      amount: amount,
      description: description
    }

    return this.http.post(url, body, {headers: headers});
  }

  capturePayment(orderId: string){
    const url = this.baseUrl + '/capturePayment';
    const token = this.authService.retrieveToken();
    const rentJson = sessionStorage.getItem("rent");

    // Parse the JSON string back into a RentCreation object
    const rent: RentCreation | null = rentJson ? JSON.parse(rentJson) : null;

    const headers = {
      'Authorization': token
    };

    const params = new HttpParams().set('orderId', orderId);

    const body = {
      houseId: rent?.houseId,
      startTime: rent?.startTime,
      endTime: rent?.endTime,
    }

    return this.http.post(url, body, {headers: headers, params: params});
  }
}
