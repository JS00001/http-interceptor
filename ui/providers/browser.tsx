import { invoke } from "@tauri-apps/api/core";
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

import { Tauri } from "@shared/types";
import browserListener from "@interceptor/index";

interface BrowserContextValue {
  canConnect: boolean;
  isConnected: boolean;
  launchBrowser: () => Promise<void>;
  listenToBrowserEvents: () => Promise<void>;
  disconnectFromBrowser: () => Promise<void>;
}

const BrowserContext = createContext<BrowserContextValue>({} as BrowserContextValue);

export function BrowserProvider({ children }: { children: ReactNode }) {
  const interval = useRef<NodeJS.Timeout>();
  const [canConnect, setCanConnect] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    updateConnectionStatus();
    interval.current = setInterval(updateConnectionStatus, 5000);

    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, []);

  /**
   * Check if a browser with dev tools enabled is running. If so, set the browser as running.
   * Check if we have a websocket connection opened with the browser, if so, set the browser as connected
   */
  const updateConnectionStatus = async () => {
    await invoke<Tauri.GetChromeVersion>("fetch_chrome_version")
      .then(() => setCanConnect(true))
      .catch(() => setCanConnect(false));

    await browserListener.ping().then((connected) => setIsConnected(connected));
  };

  /**
   * Launch the chrome browser with dev tools enabled, and connect to
   * it to listen for events
   */
  const launchBrowser = async () => {
    try {
      await invoke("launch_browser");
      await browserListener.start();
      setCanConnect(true);
      setIsConnected(true);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Start the WS Connection to the browser CDP
   */
  const listenToBrowserEvents = async () => {
    try {
      await browserListener.start();
      setCanConnect(true);
      setIsConnected(true);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Close the websocket connection to the browser, does not close the
   * browser itself
   */
  const disconnectFromBrowser = async () => {
    try {
      await browserListener.close();
      setIsConnected(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <BrowserContext.Provider
      value={{
        canConnect,
        isConnected,
        launchBrowser,
        listenToBrowserEvents,
        disconnectFromBrowser,
      }}
    >
      {children}
    </BrowserContext.Provider>
  );
}

export function useBrowser() {
  const context = useContext(BrowserContext);
  return context;
}
