import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'

const Container = styled.header`
  display: flex;
  height: 415px;
  background-color: #ffffff;
  justify-content: space-between;
`

const Logo = styled.div`
  background-image: url('/logo.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  width: 190px;
  margin: 4px 0;
`

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
`

const NavLink = styled.a`
  margin: 0 4px;
  line-height: 40px;
  color: #eee;
`

const Footer: React.FC = () => {
  return (
    <Container>
      <div>
        <Logo />
        <p>
          One neutral source of truth for crypto metrics.
          <br />
          Used by everyone, managed by the community.
        </p>
      </div>

      <Nav>
        <Link href="/lists" passHref><NavLink>Lists</NavLink></Link>
        <Link href="/adapters" passHref><NavLink>Adapters</NavLink></Link>
        <NavLink href="https://forum.cryptostats.community/">Forum</NavLink>
      </Nav>
    </Container>
  )
}

export default Footer
