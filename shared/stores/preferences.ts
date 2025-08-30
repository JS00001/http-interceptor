import { produce } from 'immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CustomHeader {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

interface IPreferencesState {
  hasHydrated: boolean;
  customHeaders: CustomHeader[];
  theme:
    | 'red'
    | 'blue'
    | 'indigo'
    | 'emerald'
    | 'fuchsia'
    | 'orange'
    | 'green'
    | 'purple'
    | 'teal';
}

interface IPreferencesStore extends IPreferencesState {
  addHeader: () => void;
  removeHeader: (id: string) => void;
  updateHeader: (header: CustomHeader) => void;
  setTheme: (theme: IPreferencesState['theme']) => void;
  hydrate: () => void;
}

const usePreferencesStore = create<IPreferencesStore>()(
  persist(
    (set) => {
      const initialState: IPreferencesState = {
        hasHydrated: false,
        theme: 'indigo',
        customHeaders: [],
      };

      const setTheme = (theme: IPreferencesState['theme']) => {
        set(
          produce((draft) => {
            draft.theme = theme;
          })
        );
      };

      /**
       * Add a new custom header This adds a new row to the table and wont add the header
       * until a key and value are provided
       */
      const addHeader = () => {
        set((state) =>
          produce(state, (draft) => {
            draft.customHeaders.push({
              id: crypto.randomUUID(),
              key: '',
              value: '',
              enabled: true,
            });
          })
        );
      };

      /**
       * Update an existing header to new values. Matches based
       * on ID
       */
      const updateHeader = (header: CustomHeader) => {
        set((state) => ({
          customHeaders: state.customHeaders.map((h) => (h.id === header.id ? header : h)),
        }));
      };

      /**
       * Remove a rule based on its ID. Requests will no longer be
       * intercepted for this rule
       */
      const removeHeader = (id: string) => {
        set((state) => ({
          customHeaders: state.customHeaders.filter((h) => h.id !== id),
        }));
      };

      /**
       * Mark the store as hydrated from persisted data
       */
      const hydrate = () => {
        set((state) => ({ ...state, hasHydrated: true }));
      };

      return {
        ...initialState,
        setTheme,
        addHeader,
        removeHeader,
        updateHeader,
        hydrate,
      };
    },
    {
      name: 'preferences-store',
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error || !state) {
            return state;
          }

          return state.hydrate();
        };
      },
    }
  )
);

export default usePreferencesStore;

// For static initializations, so the var name looks cleaner
export const preferencesStore = usePreferencesStore;
