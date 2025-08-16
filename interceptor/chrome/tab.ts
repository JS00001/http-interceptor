import CDP from "chrome-remote-interface";

import { GREEN, YELLOW } from "../lib/util";

export default class Tab {
  public id: string;
  public url: string;

  private client: CDP.Client;

  constructor(id: string, url: string) {
    this.id = id;
    this.url = url;
    this.start();
  }

  private async start() {
    try {
      this.client = await CDP({ target: this.id });

      await this.client.Network.enable();
      await this.client.Page.enable();

      this.setupListeners();

      console.log(`${GREEN} Connected to tab: ${this.url}`);
    } catch (err: any) {
      console.log(`${YELLOW} Failed to connect to tab: ${err.message}`);
    }
  }

  private async setupListeners() {
    this.client.Network.requestWillBeSent((params) => {
      const { method, url, headers, postData } = params.request;
      console.log("🔍 " + url);
    });

    this.client.on("disconnect", () => {
      console.log(`${YELLOW} Disconnected from tab: ${this.url}`);
      // TODO: Potential mem leak due to not cleaning up when this event listener is hit
    });
  }

  public async close() {
    try {
      await this.client.close();
    } catch (err: any) {
      console.log(`${YELLOW} Failed to close tab: ${err.message}`);
    }
  }
}
