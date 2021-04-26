import { createContext } from 'react'

import { useAuthStore } from './auth.store'

/**
 * Uses the store.
 * @returns store with all the modules.
 */
export function useStore() {
  return {
    auth: useAuthStore(),
  }
}

export function getAuthStore() {
  const store = useStore()

  return store.auth
}

export type Store = ReturnType<typeof useStore>

export const StoreContext = createContext<Store>(null)
