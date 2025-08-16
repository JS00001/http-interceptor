import { create } from 'zustand';

interface IRequestState {
  urls: string[];
}

interface IRequestStore extends IRequestState {
  add: (url: string) => void;
}

export const useRequestStore = create<IRequestStore>()((set, get) => {
  const initialState = {
    urls: [],
  };

  const add = (url: string) => {
    // Only allow up to 500 requests, use a FIFO queue
    if (get().urls.length < 500) {
      set((state) => ({ urls: [...state.urls, url] }));
    }

    if (get().urls.length > 500) {
      get().urls.shift();
      set((state) => ({ urls: [...state.urls, url] }));
    }
  };

  return { ...initialState, add };
});

// For static initializations, so it looks cleaner
export const requestStore = useRequestStore;
