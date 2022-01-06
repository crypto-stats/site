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
  margin-top: var(--spaces-4);
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
  display: flex;
  align-items: center;
  justify-self: end;
`

const NavItem = styled.div`
  & + & {
    margin-left: var(--spaces-4);
  }
`

const NavLink = styled.a<{ active?: boolean }>`
  position: relative;
  display: inline-block;
  margin: 0 4px;
  color: #3d3d3d;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    color: var(--color-primary);
  }

  ${({ active }) => active && `
    font-weight: 700;
    color: var(--color-primary);

    &:after {
      display: block;
      content: "";
      position: absolute;
      width: 100%;
      height: 5px;
      left: 0;
      bottom: -15px;
      background-color: var(--color-primary);
    }
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
        <NavItem>
          <Link href="/discover" passHref>
            <NavLink active={router.route.indexOf('/discover') === 0}>Discover</NavLink>
          </Link>
        </NavItem>
        <NavItem>
          <Link href="/how-it-works" passHref>
            <NavLink active={router.route.indexOf('/how-it-works') === 0}>How it works</NavLink>
          </Link>
        </NavItem>
        <NavItem>
          <NavLink href="https://forum.cryptostats.community/">Forum</NavLink>
        </NavItem>
        <NavItem>
          <Link href="/editor" passHref>
            <Button variant="secondary">Create Adapter</Button>
          </Link>
        </NavItem>
        <NavItem>
          <WalletButton>{account ? name || account.substr(0, 10) : 'Connect Wallet'}</WalletButton>
        </NavItem>
      </Nav>
    </HeaderContainer>
  )
}

export default Header
