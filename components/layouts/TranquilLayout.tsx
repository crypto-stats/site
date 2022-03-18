import React from "react"
import styled from "styled-components"
import Header from "../Header"
import Footer from "../Footer"
import Breadcrumbs from "./Breadcrumbs"
import NotificationBar from "components/NotificationBar"
import Hero from "components/Hero"
import RowSection from "components/RowSection"
import ColumnSection from "components/ColumnSection"

const LayoutContainer = styled.div<{ page?: string }>`
  ${({ page }) =>
    page === "adapter" || page === "collection"
      ? `
    background: var(--color-primary-400);
  `
      : ``}
`

const HeaderContainer = styled.div<{ page?: string }>`
  ${({ page }) =>
    page === "adapter" || page === "collection"
      ? `
    box-shadow: 0 3px 18px 0 rgba(0, 0, 0, 0.05);
    background-color: #ffffff;
  `
      : ``}
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

const TranquilLayout: React.FC<TranquilLayoutProps> = ({
  children,
  hero,
  sidebar,
  breadcrumbs,
  notificationBar,
  page,
}) => {
  // Set the columns for each page
  const PageColumns = {
    page: "discover",
    HeroColumns: {
      from: "4",
      to: "9",
    },
    BodyColumns: {
      from: "3",
      to: "10",
    },
    SidebarColumns: {
      from: "10",
      to: "13",
    },
  }

  switch (page) {
    case "discover":
      PageColumns.page = "discover"
      PageColumns.HeroColumns.from = "3"
      PageColumns.HeroColumns.to = "11"
      PageColumns.BodyColumns.from = "3"
      PageColumns.BodyColumns.to = "11"
      break

    case "collection":
      PageColumns.page = "collection"
      PageColumns.HeroColumns.from = "2"
      PageColumns.HeroColumns.to = "12"
      PageColumns.BodyColumns.from = "2"
      PageColumns.BodyColumns.to = "12"
      break

    case "adapter":
      PageColumns.page = "discover"
      PageColumns.HeroColumns.from = "1"
      PageColumns.HeroColumns.to = "10"
      PageColumns.BodyColumns.from = "1"
      PageColumns.BodyColumns.to = "10"
      PageColumns.SidebarColumns.from = "10"
      PageColumns.SidebarColumns.to = "13"
      break
  }

  return (
    <LayoutContainer page={page}>
      {/* Header + Hero */}
      <HeaderContainer page={page}>
        <RowSection>
          <ColumnSection columns='12'>
            <Header />
          </ColumnSection>
        </RowSection>

        {notificationBar && (
          <RowSection fullWidth>
            <ColumnSection columns='12'>
              <NotificationBar>{notificationBar}</NotificationBar>
            </ColumnSection>
          </RowSection>
        )}

        <RowSection>
          <ColumnSection columns='12'>
            {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}
          </ColumnSection>
        </RowSection>

        <RowSection>
          <ColumnSection from={PageColumns.HeroColumns.from} to={PageColumns.HeroColumns.to}>
            <Hero>{hero}</Hero>
          </ColumnSection>
        </RowSection>
      </HeaderContainer>

      <RowSection>
        <ColumnSection
          tag='main'
          from={PageColumns.BodyColumns.from}
          to={PageColumns.BodyColumns.to}
        >
          {children}
        </ColumnSection>
        {sidebar && (
          <ColumnSection from={PageColumns.SidebarColumns.from} to={PageColumns.SidebarColumns.to}>
            <Sidebar>{sidebar}</Sidebar>
          </ColumnSection>
        )}
      </RowSection>

      <Footer />
    </LayoutContainer>
  )
}

export default TranquilLayout
