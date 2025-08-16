import WebSocket from "@tauri-apps/plugin-websocket";

import { GREEN, YELLOW } from "@interceptor/lib/util";
import { CDPRequests, CDPResponse } from "@interceptor/@types";

export default class Tab {
  public id: string;
  public url: string;

  private msgId = 0;
  private wsUrl: string;
  private ws: WebSocket | null = null;

  constructor(id: string, url: string, wsUrl: string) {
    this.id = id;
    this.url = url;
    this.wsUrl = wsUrl;

    this.start();
  }

  /**
   * Enable all features needed for the app, and start listening
   * for events
   */
  private async start() {
    this.ws = await WebSocket.connect(this.wsUrl);

    console.log(`${GREEN} Connected to tab: ${this.url}`);

    await this.send("Network.enable");
    await this.send("Page.enable");
    await this.send("Fetch.enable", {
      patterns: [{ urlPattern: "*", requestStage: "Request" }],
    });

    this.ws.addListener((event) => {
      if (typeof event.data !== "string") return;
      const message = JSON.parse(event.data) as CDPResponse;

      if (message.method) {
        this.handleEvent(message);
        return;
      }
    });
  }

  private async handleEvent({ method, params }: CDPResponse) {
    if (method == "Fetch.requestPaused") {
      await this.send("Fetch.continueRequest", { requestId: params.requestId });
      return;
    }

    if (method == "Network.requestWillBeSent") {
      const { method, url, headers, postData } = params.request;
      console.log("🔍 " + url);
      return;
    }
  }

  public async close() {
    try {
      await this.ws?.disconnect();
    } catch (err: any) {
      console.log(`${YELLOW} Failed to close tab: ${err.message}`);
    }
  }

  private async send<T extends keyof CDPRequests>(
    method: T,
    params?: CDPRequests[T]
  ) {
    if (!this.ws) return;
    const id = ++this.msgId;
    await this.ws.send(JSON.stringify({ id, method, params }));
  }
}
