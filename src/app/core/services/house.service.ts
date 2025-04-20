import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {BehaviorSubject, Observable, tap, throwError} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {HouseCreation} from '../models/houseCreation.model';
import {HousePreview} from '../models/housePreview.model';
import {HouseUpdate} from '../models/houseUpdate.model';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HouseService {

  baseUrl: string = environment.rootUrl + "/api/house";
  private filteredHousesSubject = new BehaviorSubject<HousePreview[] | null>(null);
  public filteredHouses$ = this.filteredHousesSubject.asObservable();

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

  updateFilteredHouses(houses: HousePreview[] | null) {
    this.filteredHousesSubject.next(houses);
  }

  // GET /api/house
  getAll(location: string | null, minPrice: number | null,
         maxPrice: number | null, beds: number | null,
         guests: number | null, category: string | null, currency: string | null): Observable<any> {

    let params = new HttpParams();

    if (location) params = params.append('location', location);
    if (minPrice !== null) params = params.append('minPrice', minPrice.toString());
    if (maxPrice !== null) params = params.append('maxPrice', maxPrice.toString());
    if (beds !== null) params = params.append('beds', beds.toString());
    if (guests !== null) params = params.append('guests', guests.toString());
    if (category !== null) params = params.append('category', category);
    if (currency !== null) params = params.append('currency', currency.toString());

    return this.http.get<any>(this.baseUrl, { params }).pipe(
      tap(response => {
        // Updating BehaviorSubject
        if (response && response.houses) {
          this.updateFilteredHouses(response.houses);
        }
      })
    );
  }

  getHousesNearTo(id: number, km: number, currency: string){
    const url = this.baseUrl + '/nearTo';
    const params = new HttpParams().set('id', id).set('km', km).set('currency', currency);

    return this.http.get(url, {params: params});
  }

  getHousesByOwner(id: number, currency: string){
    const url = this.baseUrl + '/owner';
    const params = new HttpParams().set('owner', id).set('currency', currency);
    return this.http.get(url, {params: params});
  }


  // GET /api/house/details
  getById(id: number, currency: string): Observable<any> {
    const url = this.baseUrl + '/details';
    const params = new HttpParams().set('id', id.toString()).set('currency', currency);

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

  //PUT /api/house/update
  update(id: number, house: HouseUpdate, newPictures: File[]): Observable<any>{
    try{
      const url = this.baseUrl + '/update';
      const token = this.authService.retrieveToken();

      const formData = new FormData();
      formData.append('house', new Blob([JSON.stringify(house)], { type: 'application/json' }));
      newPictures.forEach(picture => {formData.append('pictures', picture);});
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
