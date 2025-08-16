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

  public async updatePausePattern(urlPattern: string) {
    // Parse complex filters for each request
    this.client.Fetch.requestPaused(async ({ requestId, request }) => {
      // JACK TOOD
      // TOUCHED (Matches some filter)
      await this.client.Fetch.continueRequest({ requestId });

      // UNTOUCHED (Doesnt match pattern)
      await this.client.Fetch.continueRequest({ requestId });
    });
  }

  /**
   * Enable all features needed for the app, and start listening
   * for events
   */
  private async start() {
    try {
      this.client = await CDP({ target: this.id });

      await this.client.Network.enable();
      await this.client.Page.enable();
      await this.client.Fetch.enable({
        patterns: [{ urlPattern: "*", requestStage: "Request" }],
      });

      this.setupListeners();

      console.log(`${GREEN} Connected to tab: ${this.url}`);
    } catch (err: any) {
      console.log(`${YELLOW} Failed to connect to tab: ${err.message}`);
    }
  }

  /**
   * Listen for requests and other events
   */
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
