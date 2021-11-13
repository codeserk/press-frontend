import '../styles/app-base.scss'
import '../styles/app-components.scss'
import '../styles/app-pages.scss'

import { config, dom } from '@fortawesome/fontawesome-svg-core'
import i18n from 'i18next'
import { AppProps } from 'next/dist/next-server/lib/router/router'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { initReactI18next } from 'react-i18next'

import { AppLayout } from '../src/components/layout/AppLayout'
import { resources } from '../src/locale/config'
import { AuthStoreContext, useAuthStore } from '../src/store/auth.store'
import { NodeStoreContext, useNodeStore } from '../src/store/node.store'
import { RealmStoreContext, useRealmStore } from '../src/store/realm.store'
import { SchemaStoreContext, useSchemaStore } from '../src/store/schema.store'
import { Compose } from '../src/util/store'

config.autoAddCss = false

i18n.use(initReactI18next).init({
  lng: 'en',
  resources,
})

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const auth = useAuthStore()
  const realm = useRealmStore(auth)
  const schema = useSchemaStore(realm)
  const node = useNodeStore(realm, schema)
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
        [AuthStoreContext.Provider, { value: auth }],
        [RealmStoreContext.Provider, { value: realm }],
        [SchemaStoreContext.Provider, { value: schema }],
        [NodeStoreContext.Provider, { value: node }],
      ]}>
      <Head>
        <style>{dom.css()}</style>
      </Head>

      <AppLayout>{isInitialized && !isForbidden && <Component {...pageProps} />}</AppLayout>
    </Compose>
  )
}
