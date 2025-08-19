import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { InterceptorRule } from '@shared/types';

export interface IRulesState {
  rules: InterceptorRule[];
}

export interface IRulesStore extends IRulesState {
  addRule: (rule: InterceptorRule) => void;
  removeRule: (rule: InterceptorRule) => void;
}

const useRulesStore = create<IRulesStore>()(
  persist(
    (set, get) => {
      const initialState: IRulesState = {
        rules: [],
      };

      const addRule = (rule: InterceptorRule) => {
        set((state) => ({ rules: [...state.rules, rule] }));
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
