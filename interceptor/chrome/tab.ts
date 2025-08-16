import { CDP } from '@shared/types';
import { GREEN } from '@interceptor/lib/util';
import SocketManager from '@interceptor/lib/socket-manager';
import { requestStore } from '@shared/request-store';

export default class Tab extends SocketManager {
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
      await this.send('Fetch.continueRequest', { requestId: params.requestId });
      return;
    }

    if (method == 'Network.requestWillBeSent') {
      const { method, url, headers, postData } = params.request;
      requestStore.getState().add(url);
      console.log('🔍 ' + url);
      return;
    }
  }
}
