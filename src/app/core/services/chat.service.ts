import {Injectable} from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ChatMessage} from '../models/ChatMessage.model';
import {environment} from '../../../environments/environment';
import {ChatConversation} from '../models/ChatConversation.model';
import {MessageAttachment} from '../models/MessageAttachment.model';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private client!: Client;
  private connected = false;
  private apiUrl = environment.rootUrl;

  private messageSubject = new BehaviorSubject<ChatMessage | null>(null);
  public messages$ = this.messageSubject.asObservable();

  constructor(private http: HttpClient,
              private router: Router,
              private authService: AuthService) {}

  connect(userId: number, username: string): void {
    if (this.connected) {
      return;
    }
    const token: string | null = this.authService.retrieveToken();
    console.log("token: " + token);

    if (!token) {
      this.router.navigate(['/login']);
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${this.apiUrl}/ws/chat?token=${token}`),
      connectHeaders: {
        userId: userId.toString()
      },
      debug: function(str) {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.client.onConnect = (frame) => {
      this.connected = true;
      console.log('Connected: ' + frame);

      // Suscribe to messages
      this.client.subscribe(`/user/${username}/queue/messages`, (message) => {
        if (message.body) {
          const chatMessage = JSON.parse(message.body) as ChatMessage;
          this.messageSubject.next(chatMessage);
          console.log('[DEBUG] Emisión a messages$:', message);
        }
      });
    };

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.client.activate();
  }

  disconnect(): void {
    if (this.client && this.connected) {
      this.client.deactivate();
      this.connected = false;
    }
  }

  getConversations(): Observable<ChatConversation[]> {
    const token = this.authService.retrieveToken();
    const headers = new HttpHeaders({
      'Authorization': token,
    });
    return this.http.get<ChatConversation[]>(`${this.apiUrl}/api/chat/conversations`, {headers: headers});
  }

  getMessageHistory(otherUserId: number): Observable<ChatMessage[]> {
    const token = this.authService.retrieveToken();
    const headers = new HttpHeaders({
      'Authorization': token,
    });
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/api/chat/messages/${otherUserId}`, {headers: headers});
  }

  // websocket
  sendMessage(message: ChatMessage): void {
    if (this.connected) {
      this.client.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify({
          senderId: message.senderId,
          receiverId: message.receiverId,
          content: message.textContent,
          type: message.attachments
        })
      });
    }
  }

  markMessageAsRead(messageId: number, userId: number): void {
    if (this.connected && this.client) {
      this.client.publish({
        destination: '/app/chat.markRead',
        body: JSON.stringify({
          messageId: messageId,
          userId: userId
        })
      });
    }
  }

  sendTextMessage(receiverId: number, textContent: string): Observable<ChatMessage> {
    const token = this.authService.retrieveToken();
    const headers = new HttpHeaders({
      'Authorization': token,
    });
    const payload = {
      receiverId: receiverId,
      content: textContent
    }

    return this.http.post<ChatMessage>(`${this.apiUrl}/api/chat/send`, payload, {headers: headers});
  }

  sendAudioMessage(receiverId: number, audioFile: File): Observable<ChatMessage> {
    const token = this.authService.retrieveToken();
    const headers = new HttpHeaders({
      'Authorization': token,
    });

    const formData = new FormData();
    formData.append('receiverId', receiverId.toString());
    formData.append('audioFile', audioFile);

    return this.http.post<ChatMessage>(`${this.apiUrl}/api/chat/send-audio`, formData, {headers: headers});
  }

  sendMessageWithAttachments(receiverId: number, textContent: string, attachments: MessageAttachment[]): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(`${this.apiUrl}/api/chat/send`, {
      receiverId: receiverId,
      textContent: textContent,
      attachments: attachments
    });
  }

  uploadAttachment(file: File, type: 'IMAGE' | 'AUDIO' | 'FILE'): Observable<MessageAttachment> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.http.post<MessageAttachment>(`${this.apiUrl}/api/chat/upload-attachment`, formData);
  }
}
