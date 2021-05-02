import { AuthApi, Configuration, UserApi, UserEntity } from 'client'
import { useRouter } from 'next/router'
import { createContext, useEffect, useState } from 'react'

import { initClients } from '../api/clients'
import { http } from '../api/http'

const LOCALSTORAGE_JWT_KEY = 'token'

export function useAuthStore() {
  const router = useRouter()
  const authApi = new AuthApi(undefined, undefined, http)

  // State
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<UserEntity | null>(null)
  const [jwt, setJWT] = useState<string | null>(null)

  // Getters
  const isAuthenticated = !!user && !!jwt

  // Actions
  /**
   * Initializes the store. Tries to get the current user if three is a saved JWT.
   * If so, saves the new JWT.
   */
  async function init() {
    setIsLoading(true)

    const jwt = localStorage.getItem(LOCALSTORAGE_JWT_KEY)
    if (!jwt) {
      setIsLoading(false)
      return setIsInitialized(true)
    }

    const userApi = new UserApi(new Configuration({ apiKey: `bearer ${jwt}` }), undefined, http)

    try {
      const response = await userApi.me()
      initClients(response?.data.jwt)
      setUser(response?.data.user)
      setJWT(response?.data.jwt)
      localStorage.setItem(LOCALSTORAGE_JWT_KEY, response?.data.jwt)
    } catch (error) {
      console.error(error)
      localStorage.removeItem(LOCALSTORAGE_JWT_KEY)
    }

    setIsLoading(false)
    setIsInitialized(true)
  }

  /**
   * Login using email and password.
   * @param email
   * @param password
   * @returns whether it was possible to login or not.
   */
  async function login(email: string, password: string): Promise<boolean> {
    setIsLoading(true)

    try {
      const response = await authApi.login({ body: { email, password } })
      initClients(response?.data.jwt)
      setUser(response?.data.user)
      setJWT(response?.data.jwt)
      localStorage.setItem(LOCALSTORAGE_JWT_KEY, response?.data.jwt)

      router.push('/realm')
      return true
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }

    return false
  }

  /**
   * Registers a new user using email and password.
   * @param email
   * @param password
   * @returns whether it was possible to register or not.
   */
  async function register(email: string, password: string): Promise<boolean> {
    setIsLoading(true)

    try {
      const response = await authApi.registerUser({ body: { email, password } })
      initClients(response?.data.jwt)
      setUser(response?.data.user)
      setJWT(response?.data.jwt)
      localStorage.setItem(LOCALSTORAGE_JWT_KEY, response?.data.jwt)

      router.push('/realm')
      return true
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }

    return false
  }

  useEffect(() => {
    init()
  }, [])

  return {
    user,
    jwt,
    isInitialized,
    isLoading,

    isAuthenticated,

    login,
    register,
  }
}

export type AuthStore = ReturnType<typeof useAuthStore>

export const AuthStoreContext = createContext<AuthStore>(null)
