import { produce } from 'immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IPreferencesState {
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
  setPreference: <T extends keyof IPreferencesState>(
    preference: T,
    value: IPreferencesState[T]
  ) => void;
}

const usePreferencesStore = create<IPreferencesStore>()(
  persist(
    (set) => {
      const initialState: IPreferencesState = {
        theme: 'indigo',
      };

      const setPreference = <T extends keyof IPreferencesState>(
        preference: T,
        value: IPreferencesState[T]
      ) => {
        set((state) =>
          produce(state, (draft) => {
            draft[preference] = value;
          })
        );
      };

      return {
        ...initialState,
        setPreference,
      };
    },
    { name: 'preferences-store' }
  )
);

export default usePreferencesStore;
