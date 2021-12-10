import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'

const Container = styled.header`
  display: flex;
  height: 415px;
  background-color: #ffffff;
  border-top: solid 1px #ddd;
  justify-content: center;
  width: 100%;

  @media (max-width: 768px) {
    height: unset;
  }
`

const Inner = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1248px;
  width: calc(100% - 12px);
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    flex-direction: column;
    align-items: stretch;
  }
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

  @media (max-width: 768px) {
    margin: 12px 0;
  }
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
          <Link href="/discover" passHref><NavLink>Data Collections</NavLink></Link>
          <NavLink href="https://forum.cryptostats.community/">Forum</NavLink>
        </Nav>
        <Nav>
          <NavHeading>Social</NavHeading>
          <NavLink href="https://twitter.com/CryptoStats_">Twitter</NavLink>
          <NavLink href="/discord">Discord</NavLink>
        </Nav>
      </Inner>
    </Container>
  )
}

export default Footer
