import React, { Fragment } from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { createGlobalStyle } from 'styled-components'
import PlausibleProvider from 'next-plausible'
import { runOnce } from 'hooks/lib'
import { setCache } from 'hooks/ipfs'
import { setENSCache } from 'use-ens-name'

const GlobalStyle = createGlobalStyle`
  body, html, #__next {
    min-height: 100%;
    margin: 0;
    display: flex;
    flex-direction: column;
    flex: 1;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
  }
`

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  runOnce(() => {
    if (pageProps.ipfsCache) {
      for (const item of pageProps.ipfsCache) {
        setCache(item.cid, item.text)
      }
    }

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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;500;600;700&display=swap" rel="stylesheet" />
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
