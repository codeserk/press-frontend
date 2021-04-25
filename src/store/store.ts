import { createContext, useContext } from 'react'

/**
 * Uses the store.
 * @returns store with all the modules.
 */
export function useStore() {
  return {
    // game: useGameStore(),
  }
}

export type Store = ReturnType<typeof useStore>

export const StoreContext = createContext<Store>(null)
