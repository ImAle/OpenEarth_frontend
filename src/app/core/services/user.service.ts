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
  baseUrl: string = environment.rootUrl + "/api/user";

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
  activate(id: string): any {
    try{
      const url: string = this.baseUrl + '/activate';
      const token: string = this.authService.retrieveToken();

      const headers = new HttpHeaders({
        'Authorization': token
      });

      const params = new HttpParams().set('id', id);

      return this.http.post<any>(url, {headers: headers, params: params});
    }catch(error){
      console.error(error);
      return throwError(() => error);
    }
  }

  // POST /api/user/deactivate
  deactivate(id: string) : any {
    try{
      const url: string = this.baseUrl + '/deactivate';
      const token: string = this.authService.retrieveToken();

      const headers = new HttpHeaders({
        'Authorization': token
      });
      const params = new HttpParams().set('id', id);

      return this.http.post<any>(url, {headers: headers, params: params});
    }catch (error){
      console.error(error);
      return throwError(() => error);
    }

  }

  // GET /api/user/details
  getUser(id: string): any{
    const url: string = this.baseUrl + '/details';
    return this.http.get<any>(url);
  }

  // PUT /api/user/update
  update(id: string, user: UserUpdate, picture: File): Observable<any> {
    try{
      const url: string = this.baseUrl + '/update';
      const token: string = this.authService.retrieveToken();

      const headers = new HttpHeaders({
        'Authorization': token
      });

      let params = new HttpParams();
      params.set('id', id);

      const formData = new FormData();
      formData.append('user', new Blob([JSON.stringify(user)], { type: 'application/json' }));

      if(picture != null){
        formData.append('picture', picture);
      }

      return this.http.put<any>(url, formData, {headers: headers, params: params});
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
