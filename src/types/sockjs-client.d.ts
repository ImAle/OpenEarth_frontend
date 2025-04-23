declare module 'sockjs-client/dist/sockjs' {
  import SockJS from 'sockjs-client';
  export default class SockJS {
    constructor(url: string, _reserved?: any, options?: any);
    close(): void;
    send(data: string): void;
    onopen: ((this: WebSocket, ev: Event) => any) | null;
    onclose: ((this: WebSocket, ev: CloseEvent) => any) | null;
    onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null;
    onerror: ((this: WebSocket, ev: Event) => any) | null;
  }
}
