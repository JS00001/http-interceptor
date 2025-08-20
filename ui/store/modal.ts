import { produce } from 'immer';
import { create } from 'zustand';

interface IModalState {
  modals: {
    configure: boolean;
  };
}

interface IModalStore extends IModalState {
  open(modal: keyof IModalState['modals']): void;
  close(modal: keyof IModalState['modals']): void;
}

const useModalStore = create<IModalStore>((set) => {
  const initialState: IModalState = {
    modals: {
      configure: false,
    },
  };

  const open = (modal: keyof IModalState['modals']) => {
    set((state) =>
      produce(state, (draft) => {
        draft.modals[modal] = true;
      })
    );
  };

  const close = (modal: keyof IModalState['modals']) => {
    set((state) =>
      produce(state, (draft) => {
        draft.modals[modal] = false;
      })
    );
  };

  return {
    ...initialState,
    open,
    close,
  };
});

export default useModalStore;
