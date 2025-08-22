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

  public async dropRequest(event: NetworkEvent) {
    if (!event.fetchId) return;

    await this.send('Fetch.failRequest', {
      requestId: event.fetchId,
      errorReason: 'BlockedByClient',
    });
  }

  public async close() {
    await this.send('Fetch.disable');
    await super.close();
  }

  protected async onConnect() {
    console.log(`${GREEN} Connected to tab: ${this.url}`);

    await this.send('Network.enable');
    await this.send('Page.enable');
    await this.send('Fetch.enable', {
      patterns: [{ urlPattern: '*', requestStage: 'Request' }],
    });
  }

  protected async onEvent({ method, params }: CDP.Response) {
    if (method == 'Fetch.requestPaused') {
      await this.onRequestPaused(params);
      return;
    }

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

    // TODO
    if (method == 'Network.loadingFailed') {
      return;
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
    requestStore.getState().updateRequest(requestId, params.request);

    if (shouldIntercept) {
      requestStore.getState().addInterceptedRequest(requestId, fetchId);
      return;
    }

    await this.send('Fetch.continueRequest', { requestId: fetchId });
  }
}
