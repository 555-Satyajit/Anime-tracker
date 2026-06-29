import { create } from 'zustand';

interface TrackerState {
  isNavigating: boolean;
  setIsNavigating: (val: boolean) => void;
}

export const useTrackerStore = create<TrackerState>((set) => ({
  isNavigating: false,
  setIsNavigating: (val) => set({ isNavigating: val }),
}));
