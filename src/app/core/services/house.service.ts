import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {House} from '../models/house.model';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {HouseCreation} from '../models/houseCreation.model';
import {HousePreview} from '../models/housePreview.model';
import {HouseUpdateForm} from '../models/houseUpdateForm.model';
import {HouseUpdate} from '../models/houseUpdate.model';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HouseService {

  baseUrl: string = environment.rootUrl + "/api/house";

  constructor(private http: HttpClient, private authService: AuthService) { }

  //POST /api/house/create
  create(house: HouseCreation, pictures: File[]): Observable<any> {
    try{
      const url = this.baseUrl + '/create';
      const token = this.authService.getToken();

      if(!token){
        return throwError(() => new Error('You are not logged in'));
      }

      const formData = new FormData();
      formData.append('house', new Blob([JSON.stringify(house)], { type: 'application/json' }));
      pictures.forEach(picture => {formData.append(`pictures`, picture);});

      const headers = new HttpHeaders({
        'Authorization': token,
      });

      return this.http.post(url, formData, {headers});
    }catch(error){
      console.error(error);
      return throwError(() => error);
    }

  }

  // GET /api/house
  getAll(country?: string, minPrice?: number, maxPrice?: number, beds?: number, guests?: number, category?: string): Observable<any> {
    let params = new HttpParams();

    if (country) params.set('country', country);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (beds) params.set('beds', beds);
    if (guests) params.set('guests', guests);
    if (category) params.set('category', category);

    return this.http.get<HousePreview[]>(this.baseUrl, {params});
  }

  // GET /api/house/details
  getById(id: number): Observable<any> {
    const url = this.baseUrl + '/details';
    const params = new HttpParams().set('id', id.toString());

    return this.http.get<any>(url, {params});
  }

  // GET /api/house/categories
  getCategories(): Observable<any>{
    const url = this.baseUrl + '/categories';
    return this.http.get<string[]>(url);
  }

  // GET /api/house/status
  getStatuses(): Observable<any>{
    const url = this.baseUrl + '/status';
    return this.http.get<string[]>(url);
  }

  // GET /api/house/countries
  getCountries(): Observable<any>{
    const url = this.baseUrl + '/countries';
    return this.http.get<string[]>(url);
  }

  //PUT /api/house/update
  update(id: number, house: HouseUpdate, newPictures: File[]): Observable<any>{
    try{
      const url = this.baseUrl + '/update';
      const token = this.authService.retrieveToken();

      const formData = new FormData();
      formData.append('house', JSON.stringify(house));
      newPictures.forEach(picture => {formData.append('pictures', picture, picture.name);});
      formData.append('id', id.toString());

      const headers = new HttpHeaders({
        'Authorization': token
      });

      return this.http.put(url, formData, {headers});
    }catch(error){
      console.error(error);
      return throwError(() => error);
    }
  }

  // DELETE /api/house/delete
  delete(id: number): Observable<any>{
    try{
      const url = this.baseUrl + '/delete';
      const token = this.authService.retrieveToken();

      const headers = new HttpHeaders({
        'Authorization': token
      });

      const params = new HttpParams().set('id', id.toString());

      return this.http.delete(url, {headers, params});
    }catch (error){
      console.error(error);
      return throwError(() => error);
    }
  }

}
