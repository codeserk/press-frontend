import { createContext, useEffect, useMemo, useState } from 'react'

import { api } from '../../api/clients'
import { UserEntity } from '../../client'
import { SettingsStore } from '../settings/settings.store'

export function useAuthStore(settings: SettingsStore) {
  // State

  const [isInitialized, setInitialized] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [user, setUser] = useState<UserEntity | null>(null)

  // Getters

  const isAuthenticated = useMemo(() => !!user && !!settings.jwt, [user, settings.jwt])
  const isAdmin = useMemo(() => false, [user])

  // Actions

  /**
   * Initializes the store. Tries to get the current user if three is a saved JWT.
   * If so, saves the new JWT.
   */
  async function init() {
    setLoading(true)

    if (!settings.jwt) {
      setLoading(false)
      return setInitialized(true)
    }

    await getCurrentUser()

    setLoading(false)
    setInitialized(true)
  }

  /**
   * Tries to login using some credentials
   * @param email
   * @param password
   * @returns whether the login worked
   */
  async function login(email: string, password: string): Promise<boolean> {
    let result = false
    setLoading(true)

    try {
      const response = await api.auth.login({ body: { email, password } })

      setUser(response.data.user)
      await settings.saveJwt(response.data.jwt)
      result = true
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
    return result
  }

  async function logout() {
    setLoading(true)

    settings.removeJwt()
    setUser(null)

    setLoading(false)
  }

  /**
   * Gets the current user out of thw JWT
   */
  async function getCurrentUser() {
    setLoading(true)

    try {
      const response = await api.users.me()
      const user = response.data.user

      setUser(user)
      await settings.saveJwt(response.data.jwt)
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  // Effects

  useEffect(() => {
    if (settings.isInitialized) {
      init()
    }
  }, [settings.isInitialized])

  return {
    user,
    isInitialized,
    isLoading,
    isAuthenticated,
    isAdmin,

    login,
    logout,
  }
}

export type AuthStore = ReturnType<typeof useAuthStore>

export const AuthStoreContext = createContext<AuthStore>(null as any)
