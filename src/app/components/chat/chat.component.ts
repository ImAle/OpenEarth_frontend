import {Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewChecked} from '@angular/core';
import {Subscription} from 'rxjs';
import {CommonModule, DatePipe} from '@angular/common';
import {ChatMessage} from '../../core/models/ChatMessage.model';
import {ChatConversation} from '../../core/models/ChatConversation.model';
import {ChatService} from '../../core/services/chat.service';
import {MessageAttachment} from '../../core/models/MessageAttachment.model';
import {FormsModule} from '@angular/forms';
import {MediaRecorderService} from '../../core/services/media-recorder.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderComponent} from '../header/header.component';
import {UserService} from '../../core/services/user.service';

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    HeaderComponent
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  conversations: ChatConversation[] = [];
  messages: ChatMessage[] = [];
  selectedConversation: ChatConversation | null = null;
  userId!: number;
  username!: string;
  isEmojiPickerVisible: boolean = false;
  isAttachmentMenuVisible: boolean = false;
  private messageSubscription!: Subscription;
  private routeParamSubscription!: Subscription;
  private shouldScrollToBottom: boolean = false;

  newMessageText = '';
  pendingAttachments: MessageAttachment[] = [];

  constructor(
    private chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute,
    private mediaRecorderService: MediaRecorderService,
    private userService: UserService
  ) {
    const id = sessionStorage.getItem("id");
    const username = sessionStorage.getItem("username");

    if(id != null && username != null){
      this.userId = Number(id);
      this.username = username;
    } else {
      this.router.navigate(["error/500"]);
    }
  }

  ngOnInit(): void {
    this.chatService.connect(this.userId, this.username);

    this.messageSubscription = this.chatService.messages$.subscribe(message => {
      console.log('[DEBUG] Mensaje recibido desde messages$:', message);
      if (message) {
        this.handleIncomingMessage(message);
        this.shouldScrollToBottom = true;
      }
    });

    this.loadConversations();

    this.routeParamSubscription = this.route.params.subscribe(params => {
      const otherUserId = params['userId'];
      if (otherUserId) {
        this.initializeDirectChat(Number(otherUserId));
      }
    });
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
      this.shouldScrollToBottom = false;
    } catch (err) { }
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();

    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }

    if (this.routeParamSubscription) {
      this.routeParamSubscription.unsubscribe();
    }
  }

  initializeDirectChat(otherUserId: number): void {
    const existingConversation = this.conversations.find(conv =>
      (conv.user1Id === this.userId && conv.user2Id === otherUserId) ||
      (conv.user1Id === otherUserId && conv.user2Id === this.userId)
    );

    if (existingConversation) {
      this.selectConversation(existingConversation);
    } else {
      this.userService.getUser(otherUserId).subscribe(user => {
        this.selectedConversation = {
          id: -1,
          user1Id: this.userId,
          user1Username: this.username,
          user2Id: otherUserId,
          user2Username: user.username,
          lastActivity: new Date(),
          unreadCount: 0
        };
        this.messages = [];
      });
    }
  }

  handleImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.chatService.uploadAttachment(file, 'IMAGE').subscribe(attachment => {
        this.pendingAttachments.push(attachment);
        this.isAttachmentMenuVisible = false;
      });
    }
  }

  stopRecordingAndPreview(): void {
    this.mediaRecorderService.stopRecording().then(audioBlob => {
      const file = new File([audioBlob], `audio_${Date.now()}.mp3`, { type: 'audio/mpeg' });

      this.chatService.uploadAttachment(file, 'AUDIO').subscribe(attachment => {
        this.pendingAttachments.push(attachment);
        this.isAttachmentMenuVisible = false;
      });
    });
  }

  removeAttachment(index: number): void {
    this.pendingAttachments.splice(index, 1);
  }

  loadConversations(): void {
    this.chatService.getConversations().subscribe({
      next: (conversations) => {
        this.conversations = conversations.sort((a, b) =>
          new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
        );
      },
      error: (error) => {
        console.error('Error loading conversations:', error);
      }
    });
  }

  selectConversation(conversation: ChatConversation): void {
    this.selectedConversation = conversation;
    this.loadMessages(this.getOtherUserId(conversation));
  }

  loadMessages(otherUserId: number): void {
    this.chatService.getMessageHistory(otherUserId).subscribe(messages => {
      this.messages = messages;
      this.shouldScrollToBottom = true;

      messages.forEach(message => {
        if (message.id != undefined && message.receiverId === this.userId && !message.read) {
          this.chatService.markMessageAsRead(message.id, this.userId);
        }
      });

      if (this.selectedConversation) {
        this.selectedConversation.unreadCount = 0;
      }
    });
  }

  sendMessage(): void {
    if (!this.selectedConversation || (!this.newMessageText.trim() && this.pendingAttachments.length === 0)) {
      return;
    }

    const otherUserId = this.getOtherUserId(this.selectedConversation);

    // If we have pending attachments, send them first
    if (this.pendingAttachments.length > 0) {
      // Logic for sending attachments would go here
      // For now, just handle text messages
    }

    if (this.newMessageText.trim()) {
      this.chatService.sendTextMessage(otherUserId, this.newMessageText).subscribe({
        next: (message) => {
          this.messages = [...this.messages, message];
          this.newMessageText = '';
          this.shouldScrollToBottom = true;

          if (this.selectedConversation) {
            this.selectedConversation = {
              ...this.selectedConversation,
              lastActivity: new Date(),
              lastMessage: message
            };

            if (this.selectedConversation.id === -1) {
              this.refreshConversations();
            } else {
              this.updateConversationInList(this.selectedConversation);
            }
          }
        },
        error: (error) => {
          console.error('Error sending message:', error);
        }
      });
    }
  }

  sendAudio(audioBlob: Blob): void {
    if (!this.selectedConversation) {
      return;
    }

    const otherUserId = this.getOtherUserId(this.selectedConversation);
    const audioFile = new File([audioBlob], `audio_${Date.now()}.mp3`, { type: 'audio/mpeg' });

    this.chatService.sendAudioMessage(otherUserId, audioFile).subscribe(message => {
      this.messages.push(message);
      this.shouldScrollToBottom = true;

      if (this.selectedConversation) {
        this.selectedConversation.lastActivity = new Date();
        this.selectedConversation['lastMessage'] = message;

        if (this.selectedConversation.id === -1) {
          this.refreshConversations();
        } else {
          this.updateConversationInList(this.selectedConversation);
        }
      }
    });
  }

  async startRecording(): Promise<void> {
    if (navigator.mediaDevices && await navigator.mediaDevices.getUserMedia()) {
      this.mediaRecorderService.startRecording().then(() => {
        // Recording started
      }).catch(error => {
        console.error('Error accessing microphone:', error);
      });
    }
  }

  stopRecordingAndSend(): void {
    this.mediaRecorderService.stopRecording().then(audioBlob => {
      this.sendAudio(audioBlob);
    });
  }

  getOtherUserId(conversation: ChatConversation): number {
    return conversation.user1Id === this.userId ? conversation.user2Id : conversation.user1Id;
  }

  getOtherUsername(conversation: ChatConversation): string {
    return conversation.user1Id === this.userId ? conversation.user2Username : conversation.user1Username;
  }

  addEmoji(emoji: string): void {
    this.newMessageText += emoji;
    this.isEmojiPickerVisible = false;
  }

  toggleEmojiPicker(): void {
    this.isEmojiPickerVisible = !this.isEmojiPickerVisible;
    if (this.isEmojiPickerVisible) {
      this.isAttachmentMenuVisible = false;
    }
  }

  toggleAttachmentMenu(): void {
    this.isAttachmentMenuVisible = !this.isAttachmentMenuVisible;
    if (this.isAttachmentMenuVisible) {
      this.isEmojiPickerVisible = false;
    }
  }

  isMyMessage(message: ChatMessage): boolean {
    return message.senderId === this.userId;
  }

  handleIncomingMessage(message: ChatMessage): void {
    console.log('[DEBUG] Procesando mensaje entrante:', message);
    const conversationIndex = this.conversations.findIndex(conv =>
      (conv.user1Id === message.senderId && conv.user2Id === message.receiverId) ||
      (conv.user1Id === message.receiverId && conv.user2Id === message.senderId)
    );

    if (conversationIndex !== -1) {
      const conversation = this.conversations[conversationIndex];

      const isCurrentConversation = this.selectedConversation &&
        ((this.getOtherUserId(this.selectedConversation) === message.senderId && this.userId === message.receiverId) ||
          (this.getOtherUserId(this.selectedConversation) === message.receiverId && this.userId === message.senderId));

      const updatedConversation = {
        ...conversation,
        lastActivity: message.timestamp || new Date(),
        lastMessage: message,
        unreadCount: isCurrentConversation && message.senderId !== this.userId ? 0 :
          message.senderId !== this.userId ? conversation.unreadCount + 1 : conversation.unreadCount
      };

      let updatedConversations = [...this.conversations];
      updatedConversations.splice(conversationIndex, 1);
      updatedConversations = [updatedConversation, ...updatedConversations];
      this.conversations = updatedConversations;

      if (isCurrentConversation) {
        this.selectedConversation = updatedConversation;
        this.messages = [...this.messages, message];
        // Mark that we should scroll to bottom when view is checked
        this.shouldScrollToBottom = true;

        if (message.id != undefined && message.receiverId === this.userId && !message.read) {
          this.chatService.markMessageAsRead(message.id, this.userId);
        }
      }
    }
  }

  refreshConversations(): void {
    this.loadConversations();
  }

  updateConversationInList(conversation: ChatConversation): void {
    const index = this.conversations.findIndex(c => c.id === conversation.id);
    if (index !== -1) {
      const updatedConversations = [...this.conversations];
      updatedConversations.splice(index, 1);
      updatedConversations.unshift(conversation);
      this.conversations = updatedConversations;
    }
  }
}
