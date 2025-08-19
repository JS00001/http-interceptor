import { create } from 'zustand';
import Protocol from 'devtools-protocol';

import { NetworkEvent } from '@shared/types';

interface IRequestState {
  events: { [requestId: string]: NetworkEvent };
  interceptedEvents: { [requestId: string]: NetworkEvent };
}

interface IRequestStore extends IRequestState {
  clear: () => void;

  // Typical Network Events
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

  // Intercepted Network Events
  addInterceptedRequest: (
    requestId: string,
    tabId: string,
    request: Protocol.Network.Request
  ) => void;
}

const REQUEST_LIMIT = 500;

export const useRequestStore = create<IRequestStore>()((set, get) => {
  const initialState = {
    events: {},
    interceptedEvents: {},
  };

  // Only allow up to 500 requests using a FIFO queue
  const addRequest = (
    requestId: string,
    tabId: string,
    request: Protocol.Network.Request,
    type?: Protocol.Network.ResourceType
  ) => {
    if (Object.keys(get().events).length < REQUEST_LIMIT) {
      set((state) => ({
        events: { ...state.events, [requestId]: { request, type, tabId, requestId } },
      }));
      return;
    }

    set((state) => {
      const stateData = { ...state.events };
      const keys = Object.keys(stateData);
      delete stateData[keys[0]];
      return { events: { ...stateData, [requestId]: { request, type, tabId, requestId } } };
    });
  };

  /**
   * Add a correlated response to an initial request
   */
  const addResponse = (
    requestId: string,
    response: Protocol.Network.Response,
    type?: Protocol.Network.ResourceType
  ) => {
    if (!get().events[requestId]) return;

    set((state) => ({
      events: { ...state.events, [requestId]: { ...state.events[requestId], response, type } },
    }));
  };

  /**
   * Add an intercepted request to the store
   */
  const addInterceptedRequest = (
    requestId: string,
    tabId: string,
    request: Protocol.Network.Request
  ) => {
    set((state) => ({
      interceptedEvents: {
        ...state.interceptedEvents,
        [requestId]: { request, tabId, requestId },
      },
    }));
  };

  const clear = () => {
    set({ events: {} });
  };

  return { ...initialState, addRequest, addResponse, addInterceptedRequest, clear };
});

// For static initializations, so it looks cleaner
export const requestStore = useRequestStore;
