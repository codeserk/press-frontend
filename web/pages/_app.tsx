import '../styles/antd.less'

import { config as fontAwesomeConfig, dom } from '@fortawesome/fontawesome-svg-core'
import { resources } from 'core/i18n/resources'
import { AuthStoreContext, useAuthStore } from 'core/modules/auth/auth.store'
import { NodeStoreContext, useNodeStore } from 'core/modules/nodes/node.store'
import { RealmStoreContext, useRealmStore } from 'core/modules/realms/realm.store'
import { SchemaStoreContext, useSchemaStore } from 'core/modules/schemas/schema.store'
import { useSettingsStore } from 'core/modules/settings/settings.store'
import { Compose } from 'core/utils/store'
import i18n from 'i18next'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { initReactI18next } from 'react-i18next'

import { AppLayout } from '../src/components/layout/AppLayout'
import { config } from '../src/config'
import { LocalStorageRepository } from '../src/util/local-storage.repository'

fontAwesomeConfig.autoAddCss = false

i18n.use(initReactI18next).init({
  lng: 'en',
  resources,
})

const localStorageRepository = new LocalStorageRepository()

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  const settings = useSettingsStore(config, localStorageRepository)
  const auth = useAuthStore(settings)
  const realm = useRealmStore(router.query, auth)
  const schema = useSchemaStore(router.query, realm)
  const node = useNodeStore(router.query, realm, schema)
  const { isInitialized, isAuthenticated } = auth
  const isForbidden = isInitialized && !isAuthenticated && !router.asPath.includes('/auth')

  useEffect(() => {
    if (isForbidden) {
      router?.push('/auth/login')
    }
  }, [isForbidden])

  return (
    <Compose
      components={[
        [AuthStoreContext.Provider, { value: auth, displayName: 'Auth' }],
        [RealmStoreContext.Provider, { value: realm, displayName: 'Realm' }],
        [SchemaStoreContext.Provider, { value: schema, displayName: 'Schema' }],
        [NodeStoreContext.Provider, { value: node, displayName: 'Node' }],
      ]}>
      <Head>
        <style>{dom.css()}</style>
      </Head>

      <AppLayout>{isInitialized && !isForbidden && <Component {...pageProps} />}</AppLayout>
    </Compose>
  )
}
