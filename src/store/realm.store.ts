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

  // Actions
  async function loadRealm() {
    const response = await realmAPI.getRealms()
    const realmsById: Record<string, RealmEntity> = {}
    for (const realm of response.data) {
      realmsById[realm.id] = realm
    }
    setRealms(realmsById)
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
  }
}

export type RealmStore = ReturnType<typeof useRealmStore>

export const RealmStoreContext = createContext<RealmStore>(null)
