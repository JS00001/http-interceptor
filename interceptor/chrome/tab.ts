import { GREEN } from "@interceptor/lib/util";
import { CDPResponse } from "@interceptor/@types";
import SocketManager from "@interceptor/lib/socket-manager";

export default class Tab extends SocketManager {
  public id: string;
  public url: string;

  constructor(id: string, url: string, wsUrl: string) {
    super(wsUrl);

    this.id = id;
    this.url = url;
    this.connect();
  }

  async onConnect() {
    console.log(`${GREEN} Connected to tab: ${this.url}`);

    await this.send("Network.enable");
    await this.send("Page.enable");
    await this.send("Fetch.enable", {
      patterns: [{ urlPattern: "*", requestStage: "Request" }],
    });
  }

  async onEvent({ method, params }: CDPResponse) {}
}
