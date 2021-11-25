import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'

const Container = styled.header`
  display: flex;
  height: 415px;
  background-color: #ffffff;
  border-top: solid 1px #ddd;
  justify-content: center;
`

const Inner = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1248px;
  width: calc(100% - 12px);
  align-items: center;
`

const Logo = styled.div`
  background-image: url('/logo-all-black.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  width: 190px;
  margin: 4px 0;
  height: 40px;
`

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  margin-right: 20px;
`

const NavLink = styled.a`
  line-height: 40px;
  color: black;
  font-size: 18px;
  text-decoration: none;

  &:hover {
    color: #555;
  }
`

const NavHeading = styled.div`
  font-size: 14px;
  color: #6b6b6b;
  text-transform: uppercase;
`

const Footer: React.FC = () => {
  return (
    <Container>
      <Inner>
        <div>
          <Logo />
          <p>
            One neutral source of truth for crypto metrics.
            <br />
            Used by everyone, managed by the community.
          </p>
        </div>

        <Nav>
          <NavHeading>Data Metrics</NavHeading>
          <Link href="/lists" passHref><NavLink>Lists</NavLink></Link>
          <Link href="/adapters" passHref><NavLink>Adapters</NavLink></Link>
          <NavLink href="https://forum.cryptostats.community/">Forum</NavLink>
        </Nav>
        <Nav>
          <NavHeading>DAO</NavHeading>
          <Link href="/lists" passHref><NavLink>Lists</NavLink></Link>
          <Link href="/adapters" passHref><NavLink>Adapters</NavLink></Link>
          <NavLink href="https://forum.cryptostats.community/">Forum</NavLink>
        </Nav>
        <Nav>
          <NavHeading>Social</NavHeading>
          <NavLink href="https://forum.cryptostats.community/">Twitter</NavLink>
          <NavLink href="https://forum.cryptostats.community/">Telegram</NavLink>
          <NavLink href="/discord">Discord</NavLink>
        </Nav>
      </Inner>
    </Container>
  )
}

export default Footer
