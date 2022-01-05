import React from 'react'
import styled from 'styled-components'
import Header from '../Header'
import Footer from '../Footer'
import Breadcrumbs from './Breadcrumbs'
import NotificationBar from 'components/NotificationBar'
import Hero from 'components/Hero'
import RowSection from 'components/RowSection'
import ColumnSection from 'components/ColumnSection'

const LayoutContainer = styled.div<{ page?:string }>`
  ${({page})=> page === "adapter" || page === "collection" ? `
    background: var(--color-primary-400);
  ` : ``}
  
`

const HeaderContainer = styled.div<{page?:string}>`
  ${({page})=> page === "adapter" || page === "collection" ? `
    box-shadow: 0 3px 18px 0 rgba(0, 0, 0, 0.05);
    background-color: #ffffff;
  ` : ``}
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 32px;
`

const Sidebar = styled.div`
  margin-bottom: 40px;

  @media (min-width: 768px) {
    margin-bottom: 0;
    position: sticky;
    top: calc(150px + var(--spaces-4));
    bottom: var(--spaces-4);
    transform: translateY(-150px);
  } 
`

interface TranquilLayoutProps {
  hero: React.ReactNode
  sidebar?: React.ReactNode
  breadcrumbs?: { name: string; path: string }[]
  notificationBar?: React.ReactNode
  page?: string
}

const TranquilLayout: React.FC<TranquilLayoutProps> = ({ children, hero, sidebar, breadcrumbs, notificationBar, page }) => {
  return (
    <LayoutContainer page={page}>

      {/* Header + Hero */}
      <HeaderContainer page={page}>
        <RowSection>
          <ColumnSection columns="12">
            <Header />
          </ColumnSection>
        </RowSection>
        
        {notificationBar && (
          <RowSection fullWidth>
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
          <ColumnSection columns={sidebar ? "9" : "7"} offset={sidebar ? "" : "4"}>
            <Hero>{hero}</Hero>          
          </ColumnSection>
        </RowSection>
      </HeaderContainer>

      <RowSection>
        <ColumnSection tag="main" columns={sidebar ? "9" : "6"} offset={sidebar ? "" : "4"}>
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

      <Footer />
    </LayoutContainer>
  )
}

export default TranquilLayout
