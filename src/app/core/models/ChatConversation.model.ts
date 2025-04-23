import {ChatMessage} from './ChatMessage.model';

export interface ChatConversation {
  id: number;
  user1Id: number;
  user1Username: string;
  user2Id: number;
  user2Username: string;
  lastActivity: Date;
  lastMessage?: ChatMessage;
  unreadCount: number;
}
