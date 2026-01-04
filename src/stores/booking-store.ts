import { create } from 'zustand'
import type { Booking, SearchFilters } from '@/types'

interface BookingState {
  currentBooking: Partial<Booking> | null
  searchFilters: SearchFilters
  isLoading: boolean
  setCurrentBooking: (booking: Partial<Booking> | null) => void
  updateBooking: (updates: Partial<Booking>) => void
  setSearchFilters: (filters: Partial<SearchFilters>) => void
  clearBooking: () => void
  setLoading: (loading: boolean) => void
}

export const useBookingStore = create<BookingState>((set) => ({
  currentBooking: null,
  searchFilters: {},
  isLoading: false,
  setCurrentBooking: (booking) => set({ currentBooking: booking }),
  updateBooking: (updates) =>
    set((state) => ({
      currentBooking: state.currentBooking
        ? { ...state.currentBooking, ...updates }
        : updates,
    })),
  setSearchFilters: (filters) =>
    set((state) => ({
      searchFilters: { ...state.searchFilters, ...filters },
    })),
  clearBooking: () => set({ currentBooking: null }),
  setLoading: (isLoading) => set({ isLoading }),
}))
