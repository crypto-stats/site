import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useENSName } from 'use-ens-name'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import ConnectionButton from './ConnectionButton'
import Button from 'components/Button'

const HeaderContainer = styled.header`
  width: 100%;
  height: auto;
  margin-bottom: var(--spaces-4);

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 30% 1fr;
    align-items: center;
    margin-bottom: 0;
  }
`

const Logo = styled.a`
  display: block;
  background-image: url('/logo.svg');
  color: transparent;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  width: 165px;
  height: 29px;
  cursor: pointer;
  margin: var(--spaces-4) auto;

  @media (min-width: 768px) {
    margin: 0 0 0 0;
  }
`

const Nav = styled.nav`
  display: inline-grid;
  grid-template-columns: repeat(4, min-content);
  grid-gap: 0 var(--spaces-3);
  align-items: center;
  justify-self: end;

`

const NavLink = styled.a<{ active?: boolean }>`
  display: inline-block;
  margin: 0 4px;
  line-height: 65px;
  color: #3d3d3d;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  margin: 0 10px;
  border-bottom: solid 5px transparent;
  cursor: pointer;

  &:hover {
    color: var(--color-primary);
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

const Header: React.FC = () => {
  const router = useRouter()
  const { account } = useWeb3React()
  const name = useENSName(account)

  return (
    <HeaderContainer>
      <Link href="/" passHref>
        <Logo>Home</Logo>
      </Link>

      <Nav>
        <Link href="/discover" passHref>
          <NavLink active={router.route.indexOf('/discover') === 0}>Discover</NavLink>
        </Link>
        <NavLink href="https://forum.cryptostats.community/">Forum</NavLink>

        <Link href="/editor" passHref>
          <Button className="secondary">Create Adapter</Button>
        </Link>

        <WalletButton>{account ? name || account.substr(0, 10) : 'Connect Wallet'}</WalletButton>
      </Nav>
    </HeaderContainer>
  )
}

export default Header
