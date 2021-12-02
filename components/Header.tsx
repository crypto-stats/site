import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import ConnectionButton from './ConnectionButton'
import { useENSName } from 'hooks/ens'

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

const WalletButton = styled(ConnectionButton)`
  border-radius: 4px;
  border: solid 1px #d6eaff;
  height: 35px;
  background: transparent;
  color: #002750;
  padding: 0 20px;
  align-self: center;

  &:hover {
    background: #f8fcff;
  }
`

const AdapterButton = styled.a`
  display: block;
  align-self: center;
  line-height: 35px;
  border-radius: 4px;
  background-color: #d6eaff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  color: #0477f4;
  padding: 0 20px;
  margin: 0 4px;

  &:hover {
    background: #c4e0fd;
  }
`

const Header: React.FC = () => {
  const router = useRouter()
  const { account } = useWeb3React()
  const name = useENSName(account)

  return (
    <Container>
      <Logo />

      <Nav>
        <Link href="/discover" passHref>
          <NavLink active={router.route.indexOf('/discover') === 0}>Discover</NavLink>
        </Link>
        <NavLink href="https://forum.cryptostats.community/">Forum</NavLink>

        <Link href="/editor" passHref>
          <AdapterButton>Create Adapter</AdapterButton>
        </Link>

        <WalletButton>{account ? name || account.substr(0, 10) : 'Connect Wallet'}</WalletButton>
      </Nav>
    </Container>
  )
}

export default Header
