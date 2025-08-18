import Protocol from 'devtools-protocol';

import { CDP } from '@shared/types';
import { GREEN } from '@interceptor/lib/util';
import { getRequestParams } from '@shared/lib';
import { requestStore } from '@shared/stores/request';
import SocketManager from '@interceptor/lib/socket-manager';

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
    const requestParams = getRequestParams(params.request);

    const matchesMethod = params.request.method === 'TESTING';
    const matchesUrl = params.request.url.includes('INTERCEPT');
    const matchesRequestParams = Object.values(requestParams).join(' ').includes('INTERCEPT');

    const shouldInterceptRequest = matchesMethod || matchesUrl || matchesRequestParams;
    if (shouldInterceptRequest) return;

    await this.send('Fetch.continueRequest', { requestId: params.requestId });
  }
}
