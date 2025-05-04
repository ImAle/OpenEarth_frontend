import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AuthService} from './auth.service';
import {UserUpdate} from '../models/userUpdate.model';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string = environment.rootUrl + "/user";

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) { }

  // GET /api/user
  getAllUsers(): any{
    try{
      const token: string = this.authService.retrieveToken();

      const headers = new HttpHeaders({
        'Authorization': token
      });

      return this.http.get<any>(this.baseUrl, {headers: headers});
    }catch(error){
      console.error(error);
      return throwError(() => error);
    }
  }

  // POST /api/user/activate
  activate(id: number): any {
    try{
      const url: string = this.baseUrl + '/activate';
      const token: string = this.authService.retrieveToken();

      const headers = new HttpHeaders({
        'Authorization': token
      });

      const params = new HttpParams().set('id', id);

      return this.http.post<any>(url,null, {headers: headers, params: params});
    }catch(error){
      return throwError(() => error);
    }
  }

  // POST /api/user/deactivate
  deactivate(id: number) : any {
    try{
      const url: string = this.baseUrl + '/deactivate';
      const token: string = this.authService.retrieveToken();

      const headers = new HttpHeaders({
        'Authorization': token
      });

      const params = new HttpParams().set('id', id);

      return this.http.post<any>(url, null, {headers: headers, params: params});
    }catch (error){
      return throwError(() => error);
    }

  }

  // GET /api/user/profile
  getProfile(): Observable<any>{
    const url: string = this.baseUrl + '/profile';
    const token: string = this.authService.retrieveToken();

    const headers = new HttpHeaders({
      'Authorization': token
    });

    return this.http.get<any>(url, {headers: headers});
  }

  // GET /api/user/details
  getUser(id: number): Observable<any>{
    const url: string = this.baseUrl + '/details';

    const params = new HttpParams().set('id', id);

    return this.http.get<any>(url, {params: params});
  }

  // PUT /api/user/picture
  update(picture: File): Observable<any> {
    try{
      const url: string = this.baseUrl + '/picture';
      const token: string = this.authService.retrieveToken();

      const headers = new HttpHeaders({
        'Authorization': token
      });

      const formData = new FormData();
        formData.append('picture', picture);

      return this.http.put<any>(url, formData, {headers: headers});
    }catch (error){
      console.error(error);
      return throwError(() => error);
    }
  }

  // DELETE /api/user/delete
  delete(id: string): Observable<any> {
    try{
      const url: string = this.baseUrl + '/delete';
      const token: string = this.authService.retrieveToken();

      const headers = new HttpHeaders({
        'Authorization': token
      });

      const params = new HttpParams().set('id', id);

      return this.http.delete<any>(url, {headers: headers, params: params});
    }catch(error){
      console.error(error);
      return throwError(() => error);
    }
  }

}
