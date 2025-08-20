import { produce } from 'immer';
import { create } from 'zustand';
import Protocol from 'devtools-protocol';

import { NetworkEvent } from '@shared/types';

interface INetworkEventState {
  events: { [requestId: string]: NetworkEvent };
  interceptedEvents: { [requestId: string]: NetworkEvent };
}

interface INetworkEventStore extends INetworkEventState {
  clear: () => void;

  // History of all network events for the session, limited to EVENT_LIMIT
  addRequest: (
    requestId: string,
    tabId: string,
    request: Protocol.Network.Request,
    type?: Protocol.Network.ResourceType
  ) => void;
  addResponse: (
    requestId: string,
    response: Protocol.Network.Response,
    type?: Protocol.Network.ResourceType
  ) => void;

  // Intercepted Network Events that are waiting on action
  addInterceptedRequest: (
    requestId: string,
    tabId: string,
    request: Protocol.Network.Request
  ) => void;
  dropRequest: (requestId: string) => void;
  forwardRequest: (requestId: string) => void;
}

const EVENT_LIMIT = 500;

export const useRequestStore = create<INetworkEventStore>()((set, get) => {
  const initialState = {
    events: {},
    interceptedEvents: {},
  };

  /**
   * Track a network request from the history. Uses a FIFO queue to limit
   * the number of requests stored in memory. Most people wont use history very often
   */
  const addRequest = (
    requestId: string,
    tabId: string,
    request: Protocol.Network.Request,
    type?: Protocol.Network.ResourceType
  ) => {
    set((state) =>
      produce(state, (draft) => {
        if (Object.keys(draft.events).length < EVENT_LIMIT) {
          draft.events[requestId] = { request, type, tabId, requestId };
          return;
        }

        const keys = Object.keys(draft.events);
        delete draft.events[keys[0]];
        draft.events[requestId] = { request, type, tabId, requestId };
      })
    );
  };

  /**
   * Add the correlated response to a request that was
   * already made
   */
  const addResponse = (
    requestId: string,
    response: Protocol.Network.Response,
    type?: Protocol.Network.ResourceType
  ) => {
    set((state) =>
      produce(state, (draft) => {
        if (!draft.events[requestId]) return;
        draft.events[requestId].type = type;
        draft.events[requestId].response = response;
      })
    );
  };

  /**
   * When a request matches an interception pattern, store it to be
   * modified, and then dropped or forwarded
   */
  const addInterceptedRequest = (
    requestId: string,
    tabId: string,
    request: Protocol.Network.Request
  ) => {
    set((state) =>
      produce(state, (draft) => {
        draft.interceptedEvents[requestId] = { request, tabId, requestId };
      })
    );
  };

  /**
   * Clear a request from the intercepted store, since we
   * dropped it, it is no longer held
   */
  const dropRequest = (requestId: string) => {
    set((state) =>
      produce(state, (draft) => {
        delete draft.interceptedEvents[requestId];
      })
    );
  };

  /**
   * Clear a request from the intercepted store, since we
   * forwarded it, it is no longer held
   */
  const forwardRequest = (requestId: string) => {
    set((state) =>
      produce(state, (draft) => {
        delete draft.interceptedEvents[requestId];
      })
    );
  };

  /**
   * Reset the store back to the initial state
   */
  const clear = () => {
    set(() => ({ ...initialState }));
  };

  return {
    ...initialState,
    addRequest,
    addResponse,
    addInterceptedRequest,
    clear,
    dropRequest,
    forwardRequest,
  };
});

// For static initializations, so the var name looks cleaner
export const requestStore = useRequestStore;
