import { invoke } from '@tauri-apps/api/core';

import { RED, YELLOW } from '@shared/lib';
import { CDP, NetworkEvent, Tauri } from '@shared/types';
import TabListener from '@interceptor/chrome/tab-listener';
import SocketManager from '@interceptor/lib/socket-manager';
import { requestStore } from '@shared/stores/network-event';

class BrowserListener extends SocketManager {
  private tabs: Record<string, TabListener> = {};

  constructor() {
    super(null);
  }

  /**
   * Close the connection to the browsers websocket, as well as killing all of the
   * tab's WS listeners
   */
  public async close() {
    await super.close();
    Object.values(this.tabs).forEach((tab) => tab.close());
    this.tabs = {};
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
   * Drop all of the selected events that have been intercepted. Finds their tabs
   * connection, and allows them to drop the request
   */
  public dropEvents(events: NetworkEvent[]) {
    for (const event of events) {
      const tab = this.findTab(event.tabId);
      if (tab) {
        tab.dropRequest(event);
        requestStore.getState().dropRequest(event.requestId);
      }
    }
  }

  /**
   * Forward and complete held requests that have been intercepted. Finds their tabs
   * connection, and allows them to forward the request
   */
  public forwardEvents(events: NetworkEvent[]) {
    for (const event of events) {
      const tab = this.findTab(event.tabId);
      if (tab) {
        tab.forwardRequest(event);
        requestStore.getState().forwardRequest(event.requestId);
      }
    }
  }

  /**
   * Enable discovering new tabs whenever we connect to the
   * chrome socket for the first time
   */
  protected async onConnect() {
    await this.send('Target.setDiscoverTargets', { discover: true });
  }

  /**
   * Listen for specific websocket events. When tabs are created or updated, update the tab connection. When
   * tabs are closed, delete their connection
   */
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
   * Get a specific tab by its ID to access its
   * connection
   */
  private findTab(id: string) {
    return this.tabs[id];
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
      const tab = new TabListener(targetId, url, tabInfo.webSocketDebuggerUrl);
      this.tabs[targetId] = tab;
    }, 500);
  }

  /**
   * Close the connection to a specific tab and remove it
   * from tracked tabs
   */
  private closeTab(targetId: string) {
    const tab = this.findTab(targetId);

    if (tab) {
      tab.close();
      delete this.tabs[targetId];
    }
  }
}

const browserListener = new BrowserListener();
export default browserListener;
