import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {catchError, Observable, tap, throwError} from 'rxjs';
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
    const params = new HttpParams()
      .set('email', email)
      .set('password', password);

    return this.http.post(url, {}, {params}).pipe(
      catchError((error) => this.handleError(error, 'login'))
    );
  }

  // POST /api/auth/register
  register(user: UserCreation): Observable<any> {
    const url = this.baseUrl + '/register';
    return this.http.post<any>(url, user).pipe(
      catchError((error) => this.handleError(error, 'register'))
    );
  }

  private handleError(error: any, method: string): Observable<never> {
    let errorMessage = 'An unexpected error occurred. Please try again later.';

    if (error.status === 400) {
      if (error.error && Array.isArray(error.error)) {
        errorMessage = error.error.map((e: any) => e.defaultMessage).join('\n');
      } else if (error.error && error.error.error) {
        errorMessage = error.error.error;
      }
    } else if (error.status === 401 && method === 'login') {
      errorMessage = 'Invalid credentials.';
    }

    return throwError(() => new Error(errorMessage));
  }

   getToken(): string | null {
     return "Bearer " + sessionStorage.getItem('token');
   }

   removeToken(): void {
     sessionStorage.removeItem('token');
   }

}
