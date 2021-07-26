import React from 'react'
import styled from 'styled-components'
import Header from './Header'

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const Layout: React.FC = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      {children}
    </LayoutContainer>
  )
}

export default Layout
