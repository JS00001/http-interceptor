export namespace Tauri {
  export type GetChromeVersion = {
    Browser: string;
    "Protocol-Version": string;
    "User-Agent": string;
    "V8-Version": string;
    "WebKit-Version": string;
    webSocketDebuggerUrl: string;
  };

  export type GetChromeTabs = Array<{
    description: string;
    devtoolsFrontendUrl: string;
    id: string;
    title: string;
    type: "page" | "background_page" | "service_worker" | string;
    url: string;
    webSocketDebuggerUrl: string;
  }>;
}
