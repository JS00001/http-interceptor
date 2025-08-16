/**
 * Response types for tauri commands
 */
export namespace Tauri {
  export type GetChromeVersion = {
    Browser: string;
    'Protocol-Version': string;
    'User-Agent': string;
    'V8-Version': string;
    'WebKit-Version': string;
    webSocketDebuggerUrl: string;
  };

  export type GetChromeTabs = Array<{
    description: string;
    devtoolsFrontendUrl: string;
    id: string;
    title: string;
    type: 'page' | 'background_page' | 'service_worker' | string;
    url: string;
    webSocketDebuggerUrl: string;
  }>;
}

/**
 * Types for sending & receiving data from the CDP socket
 */
export namespace CDP {
  export type Request = {
    'Page.enable': {};
    'Network.enable': {};
    'Fetch.disable': {};
    'Target.setDiscoverTargets': {
      discover: boolean;
    };
    'Fetch.continueRequest': {
      requestId: string;
    };
    'Fetch.enable': {
      patterns: Array<{
        urlPattern: string;
        requestStage: 'Request' | 'Response';
      }>;
    };
  };

  export type Response = {
    [K in keyof ResponseEvents]: {
      id: string;
      method: K;
      params: ResponseEvents[K];
    };
  }[keyof ResponseEvents];

  export type ResponseEvents = {
    'Target.targetCreated': {
      targetInfo: {
        targetId: string;
        type: 'page' | 'other';
        title: string;
        url: string;
      };
    };
    'Target.targetInfoChanged': {
      targetInfo: {
        targetId: string;
        type: 'page' | 'other';
        title: string;
        url: string;
      };
    };
    'Target.targetDestroyed': {
      targetId: string;
    };
    'Fetch.requestPaused': {
      requestId: string;
    };
    'Network.requestWillBeSent': {
      requestId: string;
      request: {
        url: string;
        method: string;
        headers: Record<string, string>;
        postData: string;
      };
    };
  };
}
