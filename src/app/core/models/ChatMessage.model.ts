import {MessageAttachment} from './MessageAttachment.model';

export interface ChatMessage {
  id?: number;
  senderId: number;
  senderUsername: string;
  receiverId: number;
  receiverUsername: string;
  textContent?: string;
  timestamp: Date;
  read: boolean;
  attachments: MessageAttachment[];
}
