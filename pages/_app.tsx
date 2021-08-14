import React, { Fragment } from 'react'
import type { AppProps } from 'next/app'
import { createGlobalStyle } from 'styled-components'
import { runOnce } from 'hooks/lib'
import { setCache } from 'hooks/ipfs'

const GlobalStyle = createGlobalStyle`
  body, html, #__next {
    min-height: 100%;
    margin: 0;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
`

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  runOnce(() => {
    if (pageProps.ipfsCache) {
      for (const item of pageProps.ipfsCache) {
        setCache(item.cid, item.text)
      }
    }
  })

  return (
    <Fragment>
      <GlobalStyle />
      <Component {...pageProps} />
    </Fragment>
  )
}

export default App
