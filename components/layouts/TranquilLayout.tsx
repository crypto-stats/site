import React from 'react'
import styled from 'styled-components'
import Header from '../Header'
import Footer from '../Footer'

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const Top = styled.div`
  border-bottom: solid 2px 
`

const MainContainer = styled.div`
  background: #f9fafb;
  display: flex;
  justify-content: center;
  padding: 10px 0 40px;
`

const Main = styled.main`
  max-width: 720px;
  margin: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`

interface TranquilLayoutProps {
  hero: React.ReactNode
}

const TranquilLayout: React.FC<TranquilLayoutProps> = ({ children, hero }) => {
  return (
    <LayoutContainer>
      <Top>
        <Header />
        {hero}
      </Top>
      
      <MainContainer>
        <Main>{children}</Main>
      </MainContainer>

      <Footer />
    </LayoutContainer>
  )
}

export default TranquilLayout
