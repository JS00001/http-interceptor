import { WebSocketServer, WebSocket } from "ws";

import { GREEN } from "./util";
import { IRequest } from "../@types";

class WSS {
  private clients = new Set<WebSocket>();
  private wss = new WebSocketServer({ host: "127.0.0.1", port: 8080 });

  constructor() {
    this.wss.on("listening", () => {
      console.log(`[WS] ${GREEN} Websocket server started`);
    });

    this.wss.on("connection", (ws) => {
      this.clients.add(ws);
      console.log(`[WS] ${GREEN} New client connected`);

      ws.on("close", () => {
        this.clients.delete(ws);
        console.log(`[WS] ${GREEN} Client disconnected`);
      });
    });
  }

  public broadcastRequest(request: IRequest) {
    const message = JSON.stringify(request);

    this.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(message);
      }
    });
  }
}

export default new WSS();
