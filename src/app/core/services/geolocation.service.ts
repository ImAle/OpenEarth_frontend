import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  baseUrl: string = environment.rootUrl + "/api/geo";

  constructor(private http: HttpClient) { }

  getLocationByCoords(lat: number, lng: number) {
    const url = `${this.baseUrl}/reverse?lat=${lat}&lon=${lng}`;
    return this.http.get(url);
  }

  getCoords(location: string){
    const url = `${this.baseUrl}/search?location=${location}¡`;
    return this.http.get(url);
  }

}
