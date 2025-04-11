import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AuthService} from './auth.service';
import {Message} from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.rootUrl + "/messages";

  constructor(private http: HttpClient, private authService: AuthService) { }

  // POST /api/messages/send
  send(message: Message){
    const url = this.baseUrl + '/send';
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': token,
    });

    const formData = new FormData();
    formData.append('message', new Blob([JSON.stringify(message)], { type: 'application/json' }));


    return this.http.post(url, formData, {headers});
  }

  // GET /api/message/history
  getChatHistory(receiverId: number){
    const url = this.baseUrl + '/history';
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': token,
    });

    const params = new HttpParams().set('receiverId', receiverId);

    return this.http.get<any>(url, {headers: headers, params: params});
  }
}
