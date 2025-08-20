import type { Protocol } from 'devtools-protocol';

/**
 * Most common type. A network event is a request, and its response, if
 * it exists
 */
export interface NetworkEvent {
  tabId: string;
  requestId: string;
  type?: Protocol.Network.ResourceType;
  request: Protocol.Network.Request;
  response?: Protocol.Network.Response;
}

export type InterceptorRuleField = 'url' | 'method' | 'params' | 'paramName';

export type InterceptorRuleOperator = 'equals' | 'contains' | 'notEquals' | 'notContains';

export interface InterceptorRule {
  id: string;
  field: InterceptorRuleField;
  operator: InterceptorRuleOperator;
  value: string;
  enabled: boolean;
}

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
    'Fetch.disable': {};
    'Page.enable': Protocol.Page.EnableRequest;
    'Network.enable': Protocol.Network.EnableRequest;
    'Network.getResponseBody': Protocol.Network.GetResponseBodyRequest;
    'Target.setDiscoverTargets': Protocol.Target.SetDiscoverTargetsRequest;
    'Fetch.failRequest': Protocol.Fetch.FailRequestRequest;
    'Fetch.continueRequest': Protocol.Fetch.ContinueRequestRequest;
    'Fetch.enable': Protocol.Fetch.EnableRequest;
  };

  export type Response = {
    [K in keyof ResponseEvents]: {
      id: string;
      method: K;
      params: ResponseEvents[K];
    };
  }[keyof ResponseEvents];

  export type ResponseEvents = {
    'Target.targetCreated': Protocol.Target.TargetCreatedEvent;
    'Target.targetInfoChanged': Protocol.Target.TargetInfoChangedEvent;
    'Target.targetDestroyed': Protocol.Target.TargetDestroyedEvent;
    'Fetch.requestPaused': Protocol.Fetch.RequestPausedEvent;
    'Network.responseReceived': Protocol.Network.ResponseReceivedEvent;
    'Network.requestWillBeSent': Protocol.Network.RequestWillBeSentEvent;
  };
}
