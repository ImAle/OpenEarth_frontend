export class Message {
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: number;

  constructor(senderId: number, receiverId: number, content: string, timestamp: number) {
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.content = content;
    this.timestamp = timestamp;
  }
}
