import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, throwError} from 'rxjs';
import {UserCreation} from '../models/userCreation.model';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = environment.rootUrl + "/api/auth";
  private readonly key = 'token';

  constructor(private http: HttpClient, private router: Router) { }

  // POST /api/auth/login
  login(email: string, password: string): Observable<any> {
    const url = this.baseUrl + '/login';
    const params = new HttpParams()
      .set('email', email)
      .set('password', password);

    return this.http.post(url, {}, {params});
  }

  logout(): void{
    this.removeToken();
    this.router.navigate(['/login']);
  }

  // POST /api/auth/register
  register(user: UserCreation): Observable<any> {
    const url = this.baseUrl + '/register';
    return this.http.post<any>(url, user);
  }

  // GET /api/auth/role
  getRole(){
    try{
      const url = this.baseUrl + '/role';
      const token = this.retrieveToken();

      const headers = new HttpHeaders({
        'Authorization': token
      });

      return this.http.get<any>(url, {headers});
    }catch (error: any){
      console.error(error);
      return throwError(() => error);
    }
  }

  validateResetToken(token: string){
    try{
      const url = this.baseUrl + '/validateToken';

      const headers = new HttpHeaders({
        'Authorization': token
      })

      return this.http.post(url, null, {headers: headers});
    }catch (error: any){
      console.error(error);
      return throwError(() => error);
    }
  }

  requestPasswordReset(email: string){
    try{
      const url = this.baseUrl + '/requestReset';
      const params = new HttpParams().set('email', email);

      return this.http.post(url, null, {params: params});
    }catch (error: any){
      console.error(error);
      return throwError(() => error);
    }
  }

  resetPassword(token: string, newPassword: string){
    try{
      const url = this.baseUrl + '/resetPassword';

      const headers = new HttpHeaders({
        'Authorization': token
      })

      const params = new HttpParams().set('newPassword', newPassword);

      return this.http.post(url, null, {headers: headers, params: params});
    }catch (error: any){
      console.error(error);
      return throwError(() => error);
    }
  }

  saveToken(token: string){
    localStorage.setItem(this.key, token);
  }

   getToken(): string | null{
    const token = sessionStorage.getItem(this.key);
     return token ? `Bearer ${token}` : null;
   }

   removeToken(): void {
     sessionStorage.removeItem(this.key);
   }

   retrieveToken(): string{
     const token = this.getToken();

     if(!token){
       throw new Error('You are not logged in');
     }

     return token;
   }

}
