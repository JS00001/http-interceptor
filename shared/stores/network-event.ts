import { produce } from 'immer';
import { create } from 'zustand';
import Protocol from 'devtools-protocol';

import { NetworkEvent } from '@shared/types';

interface INetworkEventState {
  /** List of request IDs for quickly checking if a request exists */
  requestIds: string[];

  /** Array of requestIDs that have been intercepted */
  interceptedEvents: string[];

  /** Map of network events by their requestID */
  events: { [requestId: string]: NetworkEvent };
}

interface INetworkEventStore extends INetworkEventState {
  /** Clear all history and intercepted events in the store */
  clear: () => void;

  /** Add a request to the history, or update it if it already exists */
  addOrUpdateRequest: (props: {
    /** The ID of the request. This is the network ID, not the fetch ID */
    requestId: string;

    /** The ID of the tab that this request was made from */
    tabId: string;

    /** The request data object */
    request: Protocol.Network.Request;

    /** The resource type of the request */
    type?: Protocol.Network.ResourceType;

    /**
     * Used to prevent race conditions. Only use this param if you want to update all fields EXCEPT the request.
     * This is important when the current request object contains MORE information than the new request would
     */
    blockRequestChanges?: boolean;
  }) => void;

  /** Add a correlated response to a request */
  addResponse: (
    /** The ID of the request. This is the network ID, not the fetch ID */
    requestId: string,

    /** The response data object */
    response: Protocol.Network.Response,

    /** The resource type of the request */
    type?: Protocol.Network.ResourceType
  ) => void;

  /** Add an error from a failed request to the history */
  setError: (requestId: string, errorText: string) => void;

  /** Remove a request from the intercepted events list */
  removeInterceptedRequest: (requestId: string) => void;

  /** Remove all requests from the intercepted events list */
  clearInterceptedEvents: () => void;

  /** Add a request to the intercepted events list */
  addInterceptedRequest: (requestId: string, fetchId?: string) => void;
}

const EVENT_LIMIT = 1500;

export const useNetworkEventStore = create<INetworkEventStore>()((set) => {
  const initialState = {
    events: {},
    requestIds: [],
    interceptedEvents: [],
  };

  /**
   * Track a network request from the history. Uses a FIFO queue to limit
   * the number of requests stored in memory. Most people wont use history very often
   */
  const addOrUpdateRequest = (props: {
    requestId: string;
    tabId: string;
    request: Protocol.Network.Request;
    type?: Protocol.Network.ResourceType;
    blockRequestChanges?: boolean;
  }) => {
    const { requestId, tabId, request, type, blockRequestChanges } = props;

    set((state) =>
      produce(state, (draft) => {
        if (draft.events[requestId]) {
          draft.events[requestId].tabId = tabId;
          if (type) draft.events[requestId].type = type;
          if (!blockRequestChanges) draft.events[requestId].request = request;
          return;
        }

        if (draft.requestIds.length >= EVENT_LIMIT) {
          const oldest = draft.requestIds.shift() as string;
          delete draft.events[oldest];
        }

        draft.events[requestId] = { request, type, tabId, requestId };
        draft.requestIds.push(requestId);
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

        // Calculate how many bytes it costs to store the request and response
        const request = draft.events[requestId].request;
        const requestSize = JSON.stringify(request).length;
        const responseSize = JSON.stringify(response).length;
        console.log(`Request size: ${requestSize} bytes, Response size: ${responseSize} bytes`);
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
   * Set the error text if an intercepted request fails
   */
  const setError = (requestId: string, errorText: string) => {
    set((state) =>
      produce(state, (draft) => {
        if (!draft.events[requestId]) return;
        draft.events[requestId].errorText = errorText;
      })
    );
  };

  /**
   * Clear a request from the intercepted store, since we
   * dropped it or forwarded it, it is no longer held
   */
  const removeInterceptedRequest = (requestId: string) => {
    set((state) => ({
      ...state,
      interceptedEvents: state.interceptedEvents.filter((id) => id !== requestId),
    }));
  };

  /**
   * Clear the list of intercepted requests
   */
  const clearInterceptedEvents = () => {
    set((state) => ({ ...state, interceptedEvents: [] }));
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
    addResponse,
    addOrUpdateRequest,
    setError,
    addInterceptedRequest,
    removeInterceptedRequest,
    clearInterceptedEvents,
  };
});

// For static initializations, so the var name looks cleaner
export const requestStore = useNetworkEventStore;
