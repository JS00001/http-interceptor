import type { Protocol } from 'devtools-protocol';

export type DataType = string | number | boolean | null | undefined;

/**
 * Most common type. A network event is a request, its response (if successful), and
 * all other relevant metadata about the requests life cycle
 */
export interface NetworkEvent {
  /** The ID of the tab that the request was made from */
  tabId: string;

  /** The request ID (or network ID) */
  requestId: string;

  /** The ID used to drop/forward the request */
  fetchId?: string;

  /** The error message, if the network request failed */
  errorText?: string;

  /** The type of the request */
  type?: Protocol.Network.ResourceType;

  /** The full request object */
  request: Protocol.Network.Request;

  /** The full response object */
  response?: Protocol.Network.Response;
}

export type ThemeColor =
  | 'red'
  | 'blue'
  | 'indigo'
  | 'emerald'
  | 'fuchsia'
  | 'orange'
  | 'green'
  | 'purple'
  | 'teal';

export type InterceptorRuleField = 'url' | 'method' | 'params' | 'paramName';

export type InterceptorRuleOperator = 'equals' | 'contains' | 'notEquals' | 'notContains';

export interface InterceptorRule {
  id: string;
  field: InterceptorRuleField;
  operator: InterceptorRuleOperator;
  value: string;
  enabled: boolean;
}

export interface CustomHeader {
  id: string;
  key: string;
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
    'Network.loadingFailed': Protocol.Network.LoadingFailedEvent;
    'Network.loadingFinished': Protocol.Network.LoadingFinishedEvent;
  };
}
