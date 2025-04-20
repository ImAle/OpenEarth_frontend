import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PictureService {
  baseUrl: string = environment.rootUrl + "/api/pictures";

  constructor(private http: HttpClient, private authService: AuthService) {}

  delete(id: number){
    const url = this.baseUrl + '/delete';
    const token = this.authService.retrieveToken();

    const headers = new HttpHeaders({
      'Authorization': token
    });

    const params = new HttpParams().set('id', id);

    return this.http.delete(url, {headers: headers, params: params});
  }
}
