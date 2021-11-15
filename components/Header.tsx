import React from 'react'
import Link from 'next/link';
import styled from 'styled-components'

const Container = styled.header`
  display: flex;
  height: 40px;
  background: gray;
  background-color: #012042;
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
`

const NavLink = styled.a`
  margin: 0 4px;
  line-height: 40px;
  color: #eee;
`

const Header: React.FC = () => {
  return (
    <Container>
      <Logo />

      <Nav>
        <Link href="/discover" passHref><NavLink>Discover</NavLink></Link>
        <Link href="/lists" passHref><NavLink>Lists</NavLink></Link>
        <Link href="/adapters" passHref><NavLink>Adapters</NavLink></Link>
        <NavLink href="https://forum.cryptostats.community/">Forum</NavLink>
      </Nav>
    </Container>
  )
}

export default Header
