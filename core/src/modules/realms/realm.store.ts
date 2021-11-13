import { createContext, useEffect, useMemo, useReducer } from 'react'

import { api } from '../../api/clients'
import { RealmEntity } from '../../client'
import { Route } from '../../interfaces/route.interface'
import { EntityReducer, entityReducer } from '../../utils/store'
import { AuthStore } from '../auth/auth.store'

export function useRealmStore(route: Route, auth: AuthStore) {
  // State
  const [realmsMap, dispatchRealms] = useReducer(
    entityReducer as EntityReducer<string, RealmEntity>,
    {},
  )

  // Getters
  const realms = useMemo(() => Object.values(realmsMap), [realmsMap])
  const currentRealmId = useMemo(() => route.realmId as string, [route.realmId])
  const currentRealm = useMemo(() => realmsMap[currentRealmId], [realmsMap, currentRealmId])

  // Actions
  async function loadRealm() {
    const response = await api.realms.getRealms()
    const realmsById: Record<string, RealmEntity> = {}
    for (const realm of response.data) {
      realmsById[realm.id] = realm
    }

    dispatchRealms({ type: 'addMany', items: response.data })
  }

  async function createRealm(name: string) {
    const response = await api.realms.createRealm({ body: { name } })

    dispatchRealms({ type: 'addOne', item: response.data })
  }

  useEffect(() => {
    if (auth.isAuthenticated) {
      loadRealm()
    }
  }, [auth.isAuthenticated])

  return {
    realms,
    currentRealmId,
    currentRealm,

    createRealm,
  }
}

export type RealmStore = ReturnType<typeof useRealmStore>

export const RealmStoreContext = createContext<RealmStore>(null)
