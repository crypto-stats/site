import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import ConnectionButton from './ConnectionButton'

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
  const { account } = useWeb3React()

  return (
    <Container>
      <Logo />

      <Nav>
        <Link href="/discover" passHref><NavLink>Discover</NavLink></Link>
        <Link href="/adapters" passHref><NavLink>Adapters</NavLink></Link>
        <NavLink href="https://forum.cryptostats.community/">Forum</NavLink>
        <ConnectionButton>{account ? account.substr(0, 10) : 'Connect Wallet'}</ConnectionButton>
      </Nav>
    </Container>
  )
}

export default Header
