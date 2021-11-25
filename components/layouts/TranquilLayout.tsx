import React from 'react'
import styled from 'styled-components'
import Header from '../Header'
import Footer from '../Footer'
import Breadcrumbs from './Breadcrumbs'

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background: #f9fafb;
`

const Top = styled.div`
  box-shadow: 0 3px 18px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;

  & h1 {
    font-size: 36px;
    font-weight: 600;
    color: #002750;
  }
`

const TopInner = styled.div`
  max-width: 1248px;
  width: calc(100% - 12px);
`

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 0 40px;
`

const Main = styled.main`
  max-width: 720px;
  width: 0;
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

const Spacer = styled.div`
  width: 288px;
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
        <TopInner>
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
        </TopInner>
      </Top>
      
      <MainContainer>
        <Main>{children}</Main>
        {sidebar && <Spacer />}
      </MainContainer>

      <Footer />
    </LayoutContainer>
  )
}

export default TranquilLayout
