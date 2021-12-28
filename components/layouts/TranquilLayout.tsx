import React from 'react'
import styled from 'styled-components'
import Header from '../Header'
import Footer from '../Footer'
import Breadcrumbs from './Breadcrumbs'
import NotificationBar from 'components/NotificationBar'
import Hero from 'components/Hero'
import RowSection from 'components/RowSection'
import ColumnSection from 'components/ColumSection'


const LayoutContainer = styled.div`
  background: #f9fafb;
`

const HeaderContainer = styled.div`
  box-shadow: 0 3px 18px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  padding: 0 0 32px;
`

const Sidebar = styled.div`
  position: sticky;
  top: calc(100px + 32px);
  bottom: 32px;
  transform: translateY(-100px);
`

interface TranquilLayoutProps {
  hero: React.ReactNode
  sidebar?: React.ReactNode
  breadcrumbs?: { name: string; path: string }[]
  notificationBar?: React.ReactNode
}

const TranquilLayout: React.FC<TranquilLayoutProps> = ({ children, hero, sidebar, breadcrumbs, notificationBar }) => {
  return (
    <LayoutContainer>

      {/* Header + Hero */}
      <HeaderContainer>
        <RowSection>
          <ColumnSection columns="12">
            <Header />
          </ColumnSection>
        </RowSection>
        
        {notificationBar && (
          <RowSection>
            <ColumnSection columns="12">
              <NotificationBar>{notificationBar}</NotificationBar>
            </ColumnSection>
          </RowSection>
        )}
          
        <RowSection>
          <ColumnSection columns="12">
            {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}
          </ColumnSection>
        </RowSection>

        <RowSection>
          <ColumnSection columns="9">
            <Hero align="left">{hero}</Hero>          
          </ColumnSection>
        </RowSection>
      </HeaderContainer>

      <RowSection>
        <ColumnSection tag="main" columns="9">
          {children}
        </ColumnSection>
        {sidebar && (
          <ColumnSection columns="3">
            <Sidebar>
              {sidebar}
            </Sidebar>
          </ColumnSection>
        )}
      </RowSection>

      {/* <Main>
        <MainInner>
          {children}
        </MainInner>
        {sidebar && (
          <Sidebar>
            <SidebarInner>{sidebar}</SidebarInner>
          </Sidebar>
        )}
      </Main> */}

      <Footer />
    </LayoutContainer>
  )
}

export default TranquilLayout
