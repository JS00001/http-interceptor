import Protocol from 'devtools-protocol';

import { CDP, NetworkEvent } from '@shared/types';
import { GREEN } from '@shared/lib';
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
    const headers = Object.entries(event.request.headers).map(([name, value]) => {
      return { name, value };
    });

    await this.send('Fetch.continueRequest', {
      headers,
      requestId: event.requestId,
    });
  }

  public async dropRequest(requestId: string) {
    await this.send('Fetch.failRequest', { requestId, errorReason: 'BlockedByClient' });
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
  }

  private async onRequestPaused(params: Protocol.Fetch.RequestPausedEvent) {
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
      requestStore.getState().addInterceptedRequest(params.requestId, this.id, params.request);
      return;
    }

    await this.send('Fetch.continueRequest', { requestId: params.requestId });
  }
}
