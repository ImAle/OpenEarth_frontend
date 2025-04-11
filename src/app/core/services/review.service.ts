import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ReviewCreation} from '../models/reviewCreation.model';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  baseUrl: string = environment.rootUrl + "/api/review";

  constructor(private http: HttpClient, private authService: AuthService) { }

  // GET /api/review/create
  create(review: ReviewCreation): any{
    const url = this.baseUrl + "/create";
    const token: string = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': token
    });

    const formData = new FormData();
    formData.append('review', new Blob([JSON.stringify(review)], { type: 'application/json' }));

    return this.http.post<any>(url, formData, {headers: headers});
  }

}
