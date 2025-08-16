export type CDPRequests = {
  "Page.enable": {};
  "Network.enable": {};
  "Fetch.disable": {};
  "Target.setDiscoverTargets": {
    discover: boolean;
  };
  "Fetch.continueRequest": {
    requestId: string;
  };
  "Fetch.enable": {
    patterns: Array<{
      urlPattern: string;
      requestStage: "Request" | "Response";
    }>;
  };
};

export type CDPResponse = {
  [K in keyof CDPResponseEvents]: {
    id: string;
    method: K;
    params: CDPResponseEvents[K];
  };
}[keyof CDPResponseEvents];

export type CDPResponseEvents = {
  "Target.targetCreated": {
    targetInfo: {
      targetId: string;
      type: "page" | "other";
      title: string;
      url: string;
    };
  };
  "Target.targetInfoChanged": {
    targetInfo: {
      targetId: string;
      type: "page" | "other";
      title: string;
      url: string;
    };
  };
  "Target.targetDestroyed": {
    targetId: string;
  };
  "Fetch.requestPaused": {
    requestId: string;
  };
  "Network.requestWillBeSent": {
    requestId: string;
    request: {
      url: string;
      method: string;
      headers: Record<string, string>;
      postData: string;
    };
  };
};
