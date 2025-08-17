import { invoke } from "@tauri-apps/api/core";
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

import { Tauri } from "@shared/types";
import browser from "@interceptor/index";

interface BrowserContextValue {
  canConnect: boolean;
  isConnected: boolean;
}

const BrowserContext = createContext<BrowserContextValue>({} as BrowserContextValue);

export function BrowserProvider({ children }: { children: ReactNode }) {
  const interval = useRef<NodeJS.Timeout>();
  const [canConnect, setCanConnect] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    updateConnectionStatus();
    interval.current = setInterval(updateConnectionStatus, 2500);

    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, []);

  const updateConnectionStatus = async () => {
    await invoke<Tauri.GetChromeVersion>("fetch_chrome_version")
      .then(() => setCanConnect(true))
      .catch(() => setCanConnect(false));

    await browser.ping().then((connected) => setIsConnected(connected));
  };

  return (
    <BrowserContext.Provider value={{ canConnect, isConnected }}>
      {children}
    </BrowserContext.Provider>
  );
}

export function useBrowser() {
  const context = useContext(BrowserContext);
  return context;
}
