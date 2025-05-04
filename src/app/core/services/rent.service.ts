import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AuthService} from './auth.service';
import {RentCreation} from '../models/rentCreation.model';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RentService {
  baseUrl = environment.rootUrl + "/rent";

  constructor(private http: HttpClient, private authService: AuthService) { }

  // POST /api/rent/create
  create(rent: RentCreation): Observable<any>{
    try{
      const url = this.baseUrl + "/create";
      const token: string = this.authService.retrieveToken();

      const headers = new HttpHeaders({
        'Authorization': token,
      });

      const formData = new FormData();
      formData.append('rent', new Blob([JSON.stringify(rent)], { type: 'application/json' }));

      return this.http.post(url, formData, {headers});
    }catch(error){
      console.error(error);
      return throwError(() => error);
    }
  }

  // GET /api/rent/myRents
  getMyRents(){
    try{
      const url = this.baseUrl + '/myRents';
      const token: string = this.authService.retrieveToken();

      const headers = new HttpHeaders({
        'Authorization': token
      });

      return this.http.get<any>(url, {headers});
    }catch(error){
      console.error(error);
      return throwError(() => error);
    }
  }

  // GET /api/rent/house
  getRentsByHouse(houseId: number): any {
    try{
      const url = this.baseUrl + '/house';

      const params = new HttpParams().set('id', houseId);

      return this.http.get<any>(url, {params: params});
    }catch(error){
      console.error(error);
      return throwError(() => error);
    }
  }

  // GET /api/rent/houses
  getRentsOfMyHouses(): any{
    try{
      const url = this.baseUrl + '/houses';
      const token: string = this.authService.retrieveToken();

      const headers = new HttpHeaders({
        'Authorization': token
      });

      return this.http.get<any>(url, {headers});
    }catch(error){
      console.error(error);
      return throwError(() => error);
    }
  }

  // POST /api/rent/cancel
  cancel(rentId: number): any{
    try{
      const url = this.baseUrl + '/cancel';
      const token: string = this.authService.retrieveToken();

      const headers = new HttpHeaders({
        'Authorization': token
      });

      const params = new HttpParams().set('rentId', rentId);

      return this.http.post<any>(url, null, {headers, params});
    }catch(error){
      console.error(error);
      return throwError(() => error);
    }
  }

}
