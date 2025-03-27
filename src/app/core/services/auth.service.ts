import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, tap} from 'rxjs';
import {UserCreation} from '../models/userCreation.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = environment.rootUrl + "/api/auth";

  constructor(private http: HttpClient) { }

  // POST /api/auth/login
  login(email: string, password: string): Observable<any> {
    const url = this.baseUrl + '/login';
    const params = {email, password};

    return this.http.post(url, null, {params}).pipe(
      tap((response: any) => {
        if(response && response.token){
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  // POST /api/auth/register
  register(user: UserCreation){
    const url = this.baseUrl + '/register';

    return this.http.post(url, user).pipe(
      tap((response: any) => {
        if(response && response.token){
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

}
