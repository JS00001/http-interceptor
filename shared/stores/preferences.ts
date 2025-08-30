import { produce } from 'immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { CustomHeader, InterceptorRule, ThemeColor } from '@shared/types';

interface IPreferencesState {
  hasHydrated: boolean;
  theme: ThemeColor;
  rules: InterceptorRule[];
  customHeaders: CustomHeader[];
}

interface IPreferencesStore extends IPreferencesState {
  // Custom header methods
  addHeader: () => void;
  removeHeader: (id: string) => void;
  updateHeader: (header: CustomHeader) => void;

  // Rule methods
  addRule: () => void;
  removeRule: (id: string) => void;
  updateRule: (rule: InterceptorRule) => void;

  // Other preferences/methods
  setTheme: (theme: IPreferencesState['theme']) => void;
  hydrate: () => void;
}

const usePreferencesStore = create<IPreferencesStore>()(
  persist(
    (set) => {
      const initialState: IPreferencesState = {
        rules: [],
        customHeaders: [],
        theme: 'indigo',
        hasHydrated: false,
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
       * Add a new interceptor rule. This adds a new row to the table and wont actually
       * intercept anything until the value is not empty
       */
      const addRule = () => {
        set((state) =>
          produce(state, (draft) => {
            draft.rules.push({
              id: crypto.randomUUID(),
              field: 'url',
              operator: 'equals',
              value: '',
              enabled: true,
            });
          })
        );
      };

      /**
       * Update an existing interceptor rule to new values. Matches based
       * on ID
       */
      const updateRule = (rule: InterceptorRule) => {
        set((state) => ({
          rules: state.rules.map((r) => (r.id === rule.id ? rule : r)),
        }));
      };

      /**
       * Remove a rule based on its ID. Requests will no longer be
       * intercepted for this rule
       */
      const removeRule = (id: string) => {
        set((state) => ({ rules: state.rules.filter((r) => r.id !== id) }));
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
        addRule,
        removeRule,
        updateRule,
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
