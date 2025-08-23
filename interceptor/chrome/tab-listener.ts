import Protocol from 'devtools-protocol';

import { GREEN } from '@shared/lib';
import { CDP, NetworkEvent } from '@shared/types';
import { requestStore } from '@shared/stores/network-event';
import SocketManager from '@interceptor/lib/socket-manager';
import { rulesStore } from '@shared/stores/interceptor-rules';
import { getRequestParams, matchesInterceptorField } from '@shared/lib';

export default class TabListener extends SocketManager {
  public id: string;
  public url: string;

  constructor(id: string, url: string, wsUrl: string) {
    super(wsUrl);

    this.id = id;
    this.url = url;
    this.connect();
  }

  /**
   * Take a paused network event, and forward it to completion. This also forwards
   * the updated headers and body
   */
  public async forwardRequest(event: NetworkEvent) {
    if (!event.fetchId) return;

    const headers = Object.entries(event.request.headers).map(([name, value]) => {
      return { name, value };
    });

    await this.send('Fetch.continueRequest', {
      headers,
      requestId: event.fetchId,
      postData: btoa(event.request.postData ?? ''),
    });
  }

  /**
   * Kill an intercepted network event from completing
   */
  public async dropRequest(event: NetworkEvent) {
    if (!event.fetchId) return;

    await this.send('Fetch.failRequest', {
      requestId: event.fetchId,
      errorReason: 'BlockedByClient',
    });
  }

  /**
   * Close the CDP WS connection. Starts by disabling request interception
   * first, so that we don't prevent all future requests
   */
  public async close() {
    await this.send('Fetch.disable');
    await super.close();
  }

  /**
   * Runs when we connect to the CDP websocket for the first
   * time
   */
  protected async onConnect() {
    console.log(`${GREEN} Connected to tab: ${this.url}`);
    await this.send('Network.enable');
    await this.send('Page.enable');
    await this.send('Fetch.enable', {
      patterns: [{ urlPattern: '*', requestStage: 'Request' }],
    });
  }

  /**
   * Main event handler for the socket. Handles all incoming messages
   * from CDP
   */
  protected async onEvent({ method, params }: CDP.Response) {
    if (method == 'Fetch.requestPaused') {
      await this.onRequestPaused(params);
      return;
    }

    // TODO: This isnt adding things for /conversation on chatgpt.com
    if (method == 'Network.requestWillBeSent') {
      requestStore
        .getState()
        .addRequest(params.requestId, this.id, params.request, params.type);
      return;
    }

    if (method == 'Network.responseReceived') {
      requestStore.getState().addResponse(params.requestId, params.response, params.type);
      return;
    }

    if (method == 'Network.loadingFailed') {
      requestStore.getState().setError(params.requestId, params.errorText);
      return;
    }

    // TODO: When loading is finished, that means that the req was sucessful, so for certain types like
    // blob:, we can mark it as (finished)
    if (method == 'Network.loadingFinished') {
    }
  }

  private async onRequestPaused(params: Protocol.Fetch.RequestPausedEvent) {
    // When tracing CDP requests, we need to standardize on using the networkId as the request ID. Fetch events have a custom 'requestId', so we
    // will use this as the fetchId
    const requestId = params.networkId;
    const fetchId = params.requestId;

    if (!requestId) {
      await this.send('Fetch.continueRequest', { requestId: fetchId });
      return;
    }

    // Default requests from Network.requestWillBeSent don't intercept the body/post data, so we need
    // to add that data manually, since Fetch.requestPaused does contain it
    requestStore.getState().updateRequest(requestId, params.request);

    const rules = rulesStore.getState().rules;
    const requestParams = getRequestParams(params.request);

    const urlString = params.request.url;
    const methodString = params.request.method;
    const requestParamsString = JSON.stringify(requestParams);
    const enabledRules = rules.filter((rule) => rule.enabled && rule.value);

    const paramNames = [
      ...Object.keys(requestParams.queryParams),
      ...Object.keys(requestParams.postData),
    ];

    let shouldIntercept = enabledRules.length > 0;

    for (const rule of enabledRules) {
      const { field, operator: type, value } = rule;

      if (field == 'method') {
        const matches = matchesInterceptorField(type, value, methodString);
        shouldIntercept &&= matches;
      } else if (field == 'url') {
        const matches = matchesInterceptorField(type, value, urlString);
        shouldIntercept &&= matches;
      } else if (field == 'paramName') {
        const matches = matchesInterceptorField(type, value, paramNames);
        shouldIntercept &&= matches;
      } else if (field == 'params') {
        const matches = matchesInterceptorField(type, value, requestParamsString);
        shouldIntercept &&= matches;
      }
    }

    if (shouldIntercept) {
      requestStore.getState().addInterceptedRequest(requestId, fetchId);
      return;
    }

    await this.send('Fetch.continueRequest', { requestId: fetchId });
  }
}
