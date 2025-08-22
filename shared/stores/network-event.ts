import { produce } from 'immer';
import { create } from 'zustand';
import Protocol from 'devtools-protocol';

import { NetworkEvent } from '@shared/types';

interface INetworkEventState {
  eventKeys: string[];
  interceptedEvents: string[]; // Array of requestIds
  events: { [requestId: string]: NetworkEvent };
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
  dropRequest: (requestId: string) => void;
  forwardRequest: (requestId: string) => void;
  addInterceptedRequest: (requestId: string, fetchId?: string) => void;
  updateRequest: (requestId: string, request: Protocol.Network.Request) => void;
}

const EVENT_LIMIT = 1500;

export const useNetworkEventStore = create<INetworkEventStore>()((set, get) => {
  const initialState = {
    events: {},
    eventKeys: [],
    interceptedEvents: [],
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
        if (draft.events[requestId]) return;

        if (draft.eventKeys.length >= EVENT_LIMIT) {
          const oldest = draft.eventKeys.shift() as string;
          delete draft.events[oldest];
        }

        draft.events[requestId] = { request, type, tabId, requestId };
        draft.eventKeys.push(requestId);
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
  const addInterceptedRequest = (requestId: string, fetchId?: string) => {
    set((state) =>
      produce(state, (draft) => {
        if (!draft.events[requestId]) return;
        draft.interceptedEvents.push(requestId);
        if (fetchId) draft.events[requestId].fetchId = fetchId;
      })
    );
  };

  /**
   * Update an intercepted request to have different
   * data
   */
  const updateRequest = (requestId: string, request: Protocol.Network.Request) => {
    set((state) =>
      produce(state, (draft) => {
        if (!draft.events[requestId]) return;
        draft.events[requestId].request = request;
      })
    );
  };

  /**
   * Clear a request from the intercepted store, since we
   * dropped it, it is no longer held
   */
  const dropRequest = (requestId: string) => {
    set((state) => ({
      ...state,
      interceptedEvents: state.interceptedEvents.filter((id) => id !== requestId),
    }));
  };

  /**
   * Clear a request from the intercepted store, since we
   * forwarded it, it is no longer held
   */
  const forwardRequest = (requestId: string) => {
    set((state) => ({
      ...state,
      interceptedEvents: state.interceptedEvents.filter((id) => id !== requestId),
    }));
  };

  /**
   * Reset the store back to the initial state
   */
  const clear = () => {
    set(() => ({ ...initialState }));
  };

  return {
    ...initialState,
    clear,
    addRequest,
    addResponse,
    updateRequest,
    addInterceptedRequest,
    dropRequest,
    forwardRequest,
  };
});

// For static initializations, so the var name looks cleaner
export const requestStore = useNetworkEventStore;
