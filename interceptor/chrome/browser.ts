import { invoke } from '@tauri-apps/api/core';

import { CDP, Tauri } from '@shared/types';
import Tab from '@interceptor/chrome/tab';
import { RED, YELLOW } from '@interceptor/lib/util';
import SocketManager from '@interceptor/lib/socket-manager';

class Browser extends SocketManager {
  private tabs: Tab[] = [];

  constructor() {
    super(null);
  }

  /**
   * Chrome takes time to start the browser and the remote interface, so
   * attempt to connect to the dev tools 10 times, backing off slowly
   */
  public async start() {
    for (let attempt = 0; attempt < 10; attempt++) {
      try {
        const data = await invoke<Tauri.GetChromeVersion>('fetch_chrome_version');
        this.websocketUrl = data.webSocketDebuggerUrl;
        await this.connect();
        return;
      } catch (err) {
        console.log(`${YELLOW} Attempt ${attempt} failed. Retrying: ${err}`);
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }

    console.log(`${RED} Failed to connect to browser after 10 attempts`);
  }

  /**
   * Enable discovering new tabs whenever we connect to the
   * chrome socket for the first time
   */
  async onConnect() {
    await this.send('Target.setDiscoverTargets', { discover: true });
  }

  async onEvent({ method, params }: CDP.Response) {
    if (method == 'Target.targetCreated') {
      const tab = params.targetInfo;
      if (tab.type === 'page' && !this.findTab(tab.targetId)) {
        this.createTab(tab.targetId, tab.url);
      }
      return;
    }

    if (method == 'Target.targetInfoChanged') {
      const tab = params.targetInfo;
      const existingTab = this.findTab(tab.targetId);
      if (tab.type === 'page' && existingTab) {
        existingTab.url = tab.url;
      }
      return;
    }

    if (method == 'Target.targetDestroyed') {
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
    const tabs = await invoke<Tauri.GetChromeTabs>('fetch_chrome_tabs');
    const tabInfo = tabs.find((tab) => tab.id === targetId);
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
}

const browser = new Browser();
export default browser;
