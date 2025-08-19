import { create } from "zustand";

interface IModalState {
  modals: {
    configure: boolean;
  };
}

interface IModalStore extends IModalState {
  open(modal: keyof IModalState["modals"]): void;
  close(modal: keyof IModalState["modals"]): void;
}

const useModalStore = create<IModalStore>((set) => ({
  modals: {
    configure: false,
  },
  open: (modal) => set((state) => ({ modals: { ...state.modals, [modal]: true } })),
  close: (modal) => set((state) => ({ modals: { ...state.modals, [modal]: false } })),
}));

export default useModalStore;
