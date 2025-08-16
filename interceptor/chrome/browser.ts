import CDP from "chrome-remote-interface";

import Tab from "./tab";
import { GREEN, RED, YELLOW } from "../lib/util";

class Browser {
  private tabs: Tab[] = [];
  private browser: CDP.Client;

  /**
   * Chrome takes time to start the browser and the remote interface, so
   * attempt to connect to the dev tools 10 times, backing off slowly
   */
  public async start() {
    let attempts = 0;

    while (attempts < 10) {
      const success = await this.connectToBrowser();
      if (success) break;

      // Back off slowly, until we've tried 10 times
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
      console.log(`${YELLOW} Attempt ${attempts} failed. Retrying...`);
      attempts++;
    }

    if (attempts === 10) {
      console.log(`${RED} Failed to connect to browser after 10 attempts`);
    }
  }

  //   TODO: HATE THIS NAMER
  public async updatePausePattern(urlPattern: string) {}

  /**
   * When the browser first loads, initialize all tabs that are currently open,
   * and start listening for new tabs
   */
  private async connectToBrowser() {
    try {
      this.browser = await CDP({ port: 9222 });

      await this.browser.Target.setDiscoverTargets({ discover: true });

      const currentTabs = await this.browser.Target.getTargets();
      const currentTabsInfo = currentTabs.targetInfos;

      for (const tab of currentTabsInfo) {
        if (tab.type === "page" && !this.findTab(tab.targetId)) {
          this.createTab(tab.targetId, tab.url);
        }
      }

      console.log(`${GREEN} Connected to browser`);

      this.setupListeners();
      return true;
    } catch (err: any) {
      console.log(`${RED} Failed to connect to browser: ${err.message}`);
      return false;
    }
  }

  /**
   * Listen for new tabs being created, and tabs closing
   */
  private setupListeners() {
    // When a new tab is opened, create a new tab
    this.browser.Target.targetCreated(async ({ targetInfo: tab }) => {
      if (tab.type === "page" && !this.findTab(tab.targetId)) {
        this.createTab(tab.targetId, tab.url);
      }
    });

    // When the page changes for a tab we're already tracking, update its URL
    this.browser.Target.targetInfoChanged(async ({ targetInfo: tab }) => {
      const existingTab = this.findTab(tab.targetId);
      if (tab.type === "page" && existingTab) {
        existingTab.url = tab.url;
      }
    });

    // When a tab is closed, remove it and cleanup its listeners
    this.browser.Target.targetDestroyed(async ({ targetId }) => {
      if (this.findTab(targetId)) {
        this.closeTab(targetId);
      }
    });
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
  private createTab(targetId: string, url: string) {
    setTimeout(() => {
      const tab = new Tab(targetId, url);
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
}

const browser = new Browser();
export default browser;
