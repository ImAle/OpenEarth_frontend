import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AuthService} from './auth.service';
import {ReportCreation} from '../models/reportCreation.model';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  baseUrl = environment.rootUrl + "/api/report";

  constructor(private http: HttpClient, private authService: AuthService) { }

  // POST /api/report/create
  create(report: ReportCreation): Observable<any>{
    try{
      const url = this.baseUrl + '/create';
      const token: string = this.authService.retrieveToken();

      const formData = new FormData();
      formData.append('report', new Blob([JSON.stringify(report)], { type: 'application/json' }));

      const headers = new HttpHeaders({
        'Authorization': token,
      });

      return this.http.post(url, formData, {headers});
    }catch(error){
      console.error(error);
      return throwError(() => error);
    }
  }

  // GET /api/report
  getAll(): Observable<any>{
    try{
      const token: string = this.authService.retrieveToken();

      const headers = new HttpHeaders({
        'Authorization': token,
      });

      return this.http.get(this.baseUrl, {headers});
    }catch(error){
      console.error(error);
      return throwError(() => error);
    }
  }

  // GET /api/report/get
  getById(id: string): Observable<any>{
    try{
      const url = this.baseUrl + '/get';
      const token: string = this.authService.retrieveToken();

      const headers = new HttpHeaders({
        'Authorization': token
      });

      const params = new HttpParams().append('id', id);

      return this.http.get(url, {headers, params});
    }catch(error){
      console.error(error);
      return throwError(() => error);
    }
  }

  // DELETE /api/report/delete
  delete(id: number): Observable<any>{
    try{
      const url = this.baseUrl + '/delete';
      const token: string = this.authService.retrieveToken();

      const headers = new HttpHeaders({
        'Authorization': token
      });

      const params = new HttpParams().append('id', id);

      return this.http.delete(url, {headers, params});
    }catch(error){
      console.error(error);
      return throwError(() => error);
    }
  }

}
