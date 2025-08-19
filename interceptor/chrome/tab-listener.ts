import Protocol from 'devtools-protocol';

import { CDP } from '@shared/types';
import { GREEN } from '@interceptor/lib/util';
import { getRequestParams, matchesInterceptorField } from '@shared/lib';
import { requestStore } from '@shared/stores/request';
import SocketManager from '@interceptor/lib/socket-manager';
import { rulesStore } from '@shared/stores/rules';

export default class TabListener extends SocketManager {
  public id: string;
  public url: string;

  constructor(id: string, url: string, wsUrl: string) {
    super(wsUrl);

    this.id = id;
    this.url = url;
    this.connect();
  }

  async onConnect() {
    console.log(`${GREEN} Connected to tab: ${this.url}`);

    await this.send('Network.enable');
    await this.send('Page.enable');
    await this.send('Fetch.enable', {
      patterns: [{ urlPattern: '*', requestStage: 'Request' }],
    });
  }

  async onEvent({ method, params }: CDP.Response) {
    if (method == 'Fetch.requestPaused') {
      await this.onRequestPaused(params);
      return;
    }

    if (method == 'Network.requestWillBeSent') {
      requestStore.getState().addRequest(params.requestId, params.request, params.type);
      return;
    }

    if (method == 'Network.responseReceived') {
      requestStore.getState().addResponse(params.requestId, params.response);
      return;
    }
  }

  private async onRequestPaused(params: Protocol.Fetch.RequestPausedEvent) {
    const rules = rulesStore.getState().rules;
    const requestParams = getRequestParams(params.request);

    let shouldIntercept = true;

    for (const rule of rules) {
      const { enabled, field, operator: type, value } = rule;
      if (!enabled) continue;

      const paramNames = Object.keys(requestParams);
      const urlString = params.request.url.toLowerCase();
      const methodString = params.request.method.toLowerCase();
      const requestParamsString = JSON.stringify(requestParams);

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

    console.log(shouldIntercept + ' ' + params.request.url.substring(0, 20));

    await this.send('Fetch.continueRequest', { requestId: params.requestId });
  }
}
