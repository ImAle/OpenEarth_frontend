import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ReviewCreation} from '../models/reviewCreation.model';
import {AuthService} from './auth.service';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  baseUrl: string = environment.rootUrl + "/api/review";

  constructor(private http: HttpClient, private authService: AuthService) { }

  // GET /api/review/create
  create(review: ReviewCreation): Observable<any> {
    try{
      const url = this.baseUrl + "/create";
      const token: string = this.authService.retrieveToken();

      const headers = new HttpHeaders({
        'Authorization': token
      });

      const formData = new FormData();
      formData.append('review', new Blob([JSON.stringify(review)], { type: 'application/json' }));

      return this.http.post<any>(url, formData, {headers: headers});
    }catch(error){
      console.error(error);
      return throwError(() => error);
    }
  }

  getFromHouseId(houseId: string): Observable<any> {
    const url = this.baseUrl + "/house";
    const params = new HttpParams().set("id", houseId);
    return this.http.get<any>(url, {params: params})
  }

}
