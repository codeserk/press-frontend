import { RealmEntity } from 'client'
import { useRouter } from 'next/router'
import { createContext, useEffect, useMemo, useState } from 'react'

import { realmAPI } from '../api/clients'
import { AuthStore } from './auth.store'

export function useRealmStore(auth: AuthStore) {
  const router = useRouter()

  // State
  const [realmsMap, setRealms] = useState<Record<string, RealmEntity>>({})

  // Getters
  const realms = useMemo(() => Object.values(realmsMap), [realmsMap])
  const currentRealmId = useMemo(() => router.query.realmId as string, [router.query.realmId])
  const currentRealm = useMemo(() => realmsMap[currentRealmId], [realmsMap, currentRealmId])

  // Mutations
  function addRealm(realm: RealmEntity) {
    const newRealms = { ...realmsMap }
    newRealms[realm.id] = realm

    setRealms(newRealms)
  }

  // Actions
  async function loadRealm() {
    const response = await realmAPI.getRealms()
    const realmsById: Record<string, RealmEntity> = {}
    for (const realm of response.data) {
      realmsById[realm.id] = realm
    }
    setRealms(realmsById)
  }

  async function createRealm(name: string) {
    const response = await realmAPI.createRealm({ body: { name } })

    addRealm(response.data)
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
