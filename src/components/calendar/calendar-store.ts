import { create } from 'zustand';

interface CalendarState {
  isNavigating: boolean;
  setIsNavigating: (val: boolean) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  isNavigating: false,
  setIsNavigating: (val) => set({ isNavigating: val }),
}));
