import WebSocket from '@tauri-apps/plugin-websocket';

import { YELLOW } from '@interceptor/lib/util';
import { CDPRequests, CDPResponse } from '@interceptor/@types';

abstract class SocketManager {
  public websocketUrl: string | null = null;

  private msgId = 0;
  private ws: WebSocket | null = null;

  constructor(websocketUrl: string | null) {
    this.websocketUrl = websocketUrl;
  }

  /**
   * Connect to a websocket, which is actually communicating with the rust WS via
   * tauri
   */
  protected async connect() {
    if (!this.websocketUrl) {
      throw new Error('Websocket URL not found');
    }

    this.ws = await WebSocket.connect(this.websocketUrl);

    this.ws.addListener((event) => {
      if (typeof event.data !== 'string') return;
      const message = JSON.parse(event.data) as CDPResponse;

      if (message.method) {
        this.onEvent(message);
        return;
      }
    });

    await this.onConnect();
  }

  /**
   * Send a message to the websocket
   */
  protected async send<T extends keyof CDPRequests>(method: T, params?: CDPRequests[T]) {
    if (!this.ws) return;
    const id = ++this.msgId;
    await this.ws.send(JSON.stringify({ id, method, params }));
  }

  /**
   * Disconnect from the websocket
   */
  protected async close() {
    try {
      await this.ws?.disconnect();
    } catch (err: any) {
      console.log(`${YELLOW} Failed to disconnect from socket: ${err.message}`);
    }
  }

  protected abstract onConnect(): Promise<void>;
  protected abstract onEvent(message: CDPResponse): Promise<void>;
}

export default SocketManager;
