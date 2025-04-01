import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AuthService} from './auth.service';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string = environment.rootUrl + "/api/user";

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) { }

  // GET /api/user
  getAllUsers(): any{
    const token: string | null = this.authService.getToken();
    if(token){
      const headers = new HttpHeaders({
        'Authorization': token
      });
      return this.http.get<User>(this.baseUrl, {headers: headers});
    }

    return {"error": "You must login first."};
  }

  // POST /api/user/activate
  activate(id: string): any {
    const url: string = this.baseUrl + '/activate';
    const token: string | null = this.authService.getToken();

    if (token) {
      const headers = new HttpHeaders({
        'Authorization': token
      });

      const params = new HttpParams();
      params.set('id', id.toString());

      return this.http.post<Map<string,string>>(url, {headers: headers, params: params});
    }

    return {"error": "You must login first."};
  }

  // POST /api/user/deactivate
  deactivate(id: string) : any {
    const url: string = this.baseUrl + '/deactivate';
    const token: string | null = this.authService.getToken();

    if (token) {
      const headers = new HttpHeaders({
        'Authorization': token
      });

      const params = new HttpParams();
      params.set('id', id.toString());

      return this.http.post<Map<string, string>>(url, {headers: headers, params: params});
    }

    return {"error": "You must login first."};
  }
}
