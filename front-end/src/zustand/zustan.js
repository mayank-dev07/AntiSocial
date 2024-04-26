import { create } from "zustand";

const useStore = create((set) => ({
  user: {},

  setUser: (newUser) => set({ user: newUser }),
}));

export default useStore;
