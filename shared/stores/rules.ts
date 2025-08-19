import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { InterceptorRule } from '@shared/types';

export interface IRulesState {
  rules: InterceptorRule[];
}

export interface IRulesStore extends IRulesState {
  addRule: () => void;
  removeRule: (rule: InterceptorRule) => void;
}

const useRulesStore = create<IRulesStore>()(
  persist(
    (set) => {
      const initialState: IRulesState = {
        rules: [],
      };

      const addRule = () => {
        const defaultRule: InterceptorRule = {
          id: crypto.randomUUID(),
          field: 'url',
          type: 'equals',
          value: '',
          enabled: true,
        };

        set((state) => ({ rules: [...state.rules, defaultRule] }));
      };

      const removeRule = (rule: InterceptorRule) => {
        set((state) => ({ rules: state.rules.filter((r) => r.id !== rule.id) }));
      };

      return {
        ...initialState,
        addRule,
        removeRule,
      };
    },
    { name: 'rules-store' }
  )
);

export default useRulesStore;

export const rulesStore = useRulesStore;
