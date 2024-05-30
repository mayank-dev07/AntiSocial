import { create } from "zustand";

const useStore = create((set) => ({
  user: {},
  counter: 0,
  setUser: (newUser) => set({ user: newUser }),
  increaseCounter: () => set((state) => ({ counter: state.counter + 1 })),
  decreaseCounter: () => set((state) => ({ counter: state.counter - 1 })),
}));

export default useStore;
