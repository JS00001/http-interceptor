import { create } from 'zustand';
import Protocol from 'devtools-protocol';

interface IRequestState {
  data: {
    [requestId: string]: {
      request: Protocol.Network.Request;
      response?: Protocol.Network.Response;
    };
  };
}

interface IRequestStore extends IRequestState {
  addRequest: (requestId: string, request: Protocol.Network.Request) => void;
  addResponse: (requestId: string, response: Protocol.Network.Response) => void;
}

const REQUEST_LIMIT = 500;

export const useRequestStore = create<IRequestStore>()((set, get) => {
  const initialState = {
    data: {},
  };

  // Only allow up to 500 requests using a FIFO queue
  const addRequest = (requestId: string, request: Protocol.Network.Request) => {
    if (Object.keys(get().data).length < REQUEST_LIMIT) {
      set((state) => ({ data: { ...state.data, [requestId]: { request } } }));
      return;
    }

    set((state) => {
      const stateData = { ...state.data };
      const keys = Object.keys(stateData);
      delete stateData[keys[0]];
      return { data: { ...stateData, [requestId]: { request } } };
    });
  };

  /**
   * Add a correlated response to an initial request
   */
  const addResponse = (requestId: string, response: Protocol.Network.Response) => {
    if (!get().data[requestId]) return;

    set((state) => ({
      data: { ...state.data, [requestId]: { ...state.data[requestId], response } },
    }));
  };

  return { ...initialState, addRequest, addResponse };
});

// For static initializations, so it looks cleaner
export const requestStore = useRequestStore;
