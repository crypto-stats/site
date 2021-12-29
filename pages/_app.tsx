import React, { Fragment } from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { createGlobalStyle } from 'styled-components'
import PlausibleProvider from 'next-plausible'
import { runOnce } from 'hooks/lib'
import { setENSCache } from 'use-ens-name'

const GlobalStyle = createGlobalStyle`
  :root {

    // Colors 
    --color-primary: #0477F4;
    --color-primary-100: #BDD0F6;
    --color-primary-200: #EEF1F7;
    --color-primary-200: #F9FAFB;
    --color-white: #FFFFFF;
    --color-dark-100: #000000;
    --color-dark-200: #0F1011;
    --color-dark-300: #131415;
    --color-dark-400: #2F2F2F;
    --color-dark-500: #282D36;
    --color-dark-600: #505050;
    --color-dark-700: #878787;

    // Containers
    --container-full: 100%;
    --container-fixed: 1280px;

    // Spaces
    --spaces-1: 4px;
    --spaces-2: 8px;
    --spaces-3: 16px;
    --spaces-4: 24px;
    --spaces-5: 32px;
    --spaces-6: 40px;
    --spaces-7: 48px;
    --spaces-8: 56px;
    --spaces-9: 64px;
    --spaces-10: 72px;
    --spaces-11: 80px;
    --spaces-12: 100px;
    --spaces-13: 140px;

    // Media Query
    --bp-small: 768px;
    --bp-medium: 992px;
    --bp-large: 1200px;
    --bp-xl: 1400px;

    // Grid
    --grid-columns: 12;
    --grid-column-gap: var(--spaces-5);
    --grid-row-gap: var(--spaces-6);
  }

  body, html, #__next {
    min-height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    flex: 1;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
  }
`

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  runOnce(() => {
    if (pageProps.ensCache) {
      for (const item of pageProps.ensCache) {
        setENSCache(item.address, item.name)
      }
    }
  })

  return (
    <Fragment>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <GlobalStyle />
      <Web3ReactProvider getLibrary={(provider: any) => new ethers.providers.Web3Provider(provider)}>
        <PlausibleProvider domain="cryptostats.community">
          <Component {...pageProps} />
        </PlausibleProvider>
      </Web3ReactProvider>
    </Fragment>
  )
}

export default App
