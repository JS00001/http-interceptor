import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IRulesState {}

export interface IRulesStore extends IRulesState {}

const rulesStore = create<IRulesStore>()(
  persist(
    (set, get) => {
      return {};
    },
    {
      name: 'rules-store',
    }
  )
);
