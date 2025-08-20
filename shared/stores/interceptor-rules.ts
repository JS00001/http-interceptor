import { produce } from 'immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { InterceptorRule } from '@shared/types';

export interface InterceptorRulesState {
  rules: InterceptorRule[];
}

export interface InterceptorRulesStore extends InterceptorRulesState {
  addRule: () => void;
  removeRule: (id: string) => void;
  updateRule: (rule: InterceptorRule) => void;
}

const useRulesStore = create<InterceptorRulesStore>()(
  persist(
    (set) => {
      const initialState: InterceptorRulesState = {
        rules: [],
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

      return {
        ...initialState,
        addRule,
        updateRule,
        removeRule,
      };
    },
    { name: 'rules-store' }
  )
);

export default useRulesStore;

// For static initializations, so the var name looks cleaner
export const rulesStore = useRulesStore;
