import React from 'react'
import styled from 'styled-components'
import Header from '../Header'
import Footer from '../Footer'
import Breadcrumbs from './Breadcrumbs'

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

const TopContent = styled.div`
  display: flex;
  height: 200px;
`

const HeroContainer = styled.div`
  flex: 1;
`

const Sidebar = styled.div`
  width: 288px;
  position: relative;
`

const SidebarInner = styled.div`
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
`

interface TranquilLayoutProps {
  hero: React.ReactNode
  sidebar?: React.ReactNode
  breadcrumbs?: { name: string; path: string }[]
}

const TranquilLayout: React.FC<TranquilLayoutProps> = ({ children, hero, sidebar, breadcrumbs }) => {
  return (
    <LayoutContainer>
      <Top>
        <Header />

        {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}

        <TopContent>
          <HeroContainer>{hero}</HeroContainer>

          {sidebar && (
            <Sidebar>
              <SidebarInner>{sidebar}</SidebarInner>
            </Sidebar>
          )}
        </TopContent>
      </Top>
      
      <MainContainer>
        <Main>{children}</Main>
      </MainContainer>

      <Footer />
    </LayoutContainer>
  )
}

export default TranquilLayout
