import React, { Fragment } from 'react'
import type { AppProps } from 'next/app'
import { createGlobalStyle } from 'styled-components'

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
  return (
    <Fragment>
      <GlobalStyle />
      <Component {...pageProps} />
    </Fragment>
  )
}

export default App
