import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import ConnectionButton from './ConnectionButton'

const Container = styled.header`
  display: flex;
  height: 65px;
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

const NavLink = styled.a<{ active?: boolean }>`
  margin: 0 4px;
  line-height: 65px;
  color: #3d3d3d;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  margin: 0 10px;

  &:hover {
    border-bottom: solid 5px #3d3d3d;
  }

  ${({ active }) => active && `
    font-weight: 700;
    color: #0477f4;
    border-bottom: solid 5px #0477f4;
  `}
`

const Header: React.FC = () => {
  const router = useRouter()
  const { account } = useWeb3React()

  return (
    <Container>
      <Logo />

      <Nav>
        <Link href="/discover" passHref>
          <NavLink active={router.route.indexOf('/discover') === 0}>Discover</NavLink>
        </Link>
        <Link href="/adapters" passHref><NavLink>Adapters</NavLink></Link>
        <NavLink href="https://forum.cryptostats.community/">Forum</NavLink>
        <ConnectionButton>{account ? account.substr(0, 10) : 'Connect Wallet'}</ConnectionButton>
      </Nav>
    </Container>
  )
}

export default Header
