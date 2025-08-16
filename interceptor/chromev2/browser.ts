import { invoke } from "@tauri-apps/api/core";
import WebSocket from "@tauri-apps/plugin-websocket";

import Tab from "@interceptor/chromev2/tab";
import { GREEN, RED, YELLOW } from "@interceptor/lib/util";
import { CDPRequests, CDPResponse } from "@interceptor/@types";

class Browser {
  private msgId = 0;
  private tabs: Tab[] = [];
  private ws: WebSocket | null = null;

  /**
   * Chrome takes time to start the browser and the remote interface, so
   * attempt to connect to the dev tools 10 times, backing off slowly
   */
  public async start() {
    for (let attempt = 0; attempt < 10; attempt++) {
      try {
        await this.connectToBrowser();
        console.log(`${GREEN} Connected to browser`);
        return;
      } catch (err) {
        console.log(
          `${YELLOW} Attempt ${attempt} failed. Retrying... Err: ${err}`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }

    console.log(`${RED} Failed to connect to browser after 10 attempts`);
  }

  /**
   * When the browser first loads, initialize all tabs that are currently open,
   * and start listening for new tabs
   */
  private async connectToBrowser() {
    const data = (await invoke("fetch_chrome_version")) as {
      webSocketDebuggerUrl: string;
    };
    const wsUrl = data.webSocketDebuggerUrl;

    if (!wsUrl) {
      throw new Error("Browser websocket URL not found");
    }

    this.ws = await WebSocket.connect(wsUrl);

    await this.send("Target.setDiscoverTargets", { discover: true });

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
    if (method == "Target.targetCreated") {
      const tab = params.targetInfo;
      if (tab.type === "page" && !this.findTab(tab.targetId)) {
        this.createTab(tab.targetId, tab.url);
      }
      return;
    }

    if (method == "Target.targetInfoChanged") {
      const tab = params.targetInfo;
      const existingTab = this.findTab(tab.targetId);
      if (tab.type === "page" && existingTab) {
        existingTab.url = tab.url;
      }
      return;
    }

    if (method == "Target.targetDestroyed") {
      this.closeTab(params.targetId);
      return;
    }
  }

  /**
   * Check whether a tab already is being tracked
   */
  private findTab(id: string) {
    return this.tabs.find((tab) => tab.id === id);
  }

  /**
   * Establish a new connection to a tab, wait 500ms to ensure
   * the tab has fully loaded
   */
  private async createTab(targetId: string, url: string) {
    const tabs = (await invoke("fetch_chrome_tabs")) as Array<any>;
    // JACK TYPES any
    const tabInfo = tabs.find((tab: any) => tab.id === targetId);
    if (!tabInfo) return;

    setTimeout(() => {
      const tab = new Tab(targetId, url, tabInfo.webSocketDebuggerUrl);
      this.tabs.push(tab);
    }, 500);
  }

  private closeTab(targetId: string) {
    const tab = this.tabs.find((tab) => tab.id === targetId);

    if (tab) {
      tab.close();
      this.tabs = this.tabs.filter((tab) => tab.id !== targetId);
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

const browser = new Browser();
export default browser;
