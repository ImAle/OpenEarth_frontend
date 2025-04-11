import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AuthService} from './auth.service';
import {ReportCreation} from '../models/reportCreation.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  baseUrl = environment.rootUrl + "/api/report";

  constructor(private http: HttpClient, private authService: AuthService) { }

  // POST /api/report/create
  create(report: ReportCreation){
    const url = this.baseUrl + '/create';
    const token: string = this.authService.getToken();

    const formData = new FormData();
    formData.append('report', new Blob([JSON.stringify(report)], { type: 'application/json' }));

    const headers = new HttpHeaders({
      'Authorization': token,
    });

    return this.http.post(url, formData, {headers});
  }

  // GET /api/report
  getAll(){
    const token: string = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': token,
    });

    return this.http.post(this.baseUrl, {headers});
  }

  // GET /api/report/get
  getById(id: string){
    const url = this.baseUrl + '/get';
    const token: string = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': token
    });

    const params = new HttpParams().append('id', id);

    return this.http.get(url, {headers, params});
  }

  // DELETE /api/report/delete
  delete(id: string){
    const url = this.baseUrl + '/delete';
    const token: string = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': token
    });

    const params = new HttpParams().append('id', id);

    return this.http.delete(url, {headers, params});
  }

}
