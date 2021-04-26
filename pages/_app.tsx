import '../styles/app-base.scss'
import '../styles/app-components.scss'

import { config, dom } from '@fortawesome/fontawesome-svg-core'
import i18n from 'i18next'
import { AppProps } from 'next/dist/next-server/lib/router/router'
import Head from 'next/head'
import { useEffect } from 'react'
import { initReactI18next } from 'react-i18next'

import { resources } from '../src/locale/config'
import { StoreContext, useStore } from '../src/store/store'

config.autoAddCss = false

i18n.use(initReactI18next).init({
  lng: 'en',
  resources,
})

export default function App({ Component, pageProps }: AppProps) {
  const store = useStore()

  return (
    <StoreContext.Provider value={store}>
      <Head>
        <style>{dom.css()}</style>
      </Head>

      <Component {...pageProps} />
    </StoreContext.Provider>
  )
}
