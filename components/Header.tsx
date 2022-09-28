import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { setRPC, useENSName } from 'use-ens-name'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import ConnectionButton from './ConnectionButton'
import Button from 'components/Button'

setRPC('https://rpc.flashbots.net/')

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  width: 100%;
  height: auto;
  margin-top: var(--spaces-4);
  margin-bottom: var(--spaces-4);

  @media (min-width: 1024px) {
    margin-bottom: 0;
    justify-content: space-between;
  }
`

const HeaderMobileWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @media (min-width: 1024px) {
    width: auto;
  }
`

const Logo = styled.a<{ dark?: boolean }>`
  display: block;
  background-image: url(${({ dark }) => (dark ? 'logo-dark.svg' : '/logo.svg')});
  color: transparent;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  width: 165px;
  height: 29px;
  cursor: pointer;
  margin: var(--spaces-2) 0;

  @media (min-width: 1024px) {
    margin: var(--spaces-4) auto;
    margin: 0 0 0 0;
  }
`

const Nav = styled.nav<{ open: boolean }>`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: var(--spaces-11);
  left: 0;
  right: 0;
  width: 100%;
  height: ${({ open }) => (open ? '260px' : '0')};
  overflow: hidden;
  background: var(--color-white);
  transition: var(--transition-fast) height;
  box-shadow: var(--box-shadow-card);
  z-index: 10;

  @media (min-width: 1024px) {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-self: end;
    position: relative;
    height: auto;
    width: auto;
    top: 0;
    background-color: transparent;
    box-shadow: none;
  }
`

const NavItem = styled.div`
  margin: 0 auto;
  text-align: center;

  @media (min-width: 1024px) {
    text-align: left;

    & + & {
      margin: 0;
      margin-left: var(--spaces-4);
    }
  }
`

const NavLink = styled.a<{ active?: boolean }>`
  position: relative;
  display: inline-block;
  margin: 0 4px;
  color: var(--color-normal-text);
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    color: var(--color-primary);
  }

  @media (max-width: 1024px) {
    margin: 20px 0;
  }

  ${({ active }) =>
    active &&
    `
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
  color: var(--color-normal-text);
  padding: 0 20px;
  align-self: center;

  &:hover {
    background: #f8fcff;
  }
`

const Hamburger = styled.button<{ open: boolean }>`
  position: relative;
  display: inline-block;
  border: none;
  background: transparent;
  outline: none;
  cursor: pointer;

  @media (min-width: 1024px) {
    display: none;
  }

  & span {
    width: var(--spaces-5);
    height: var(--spaces-1);
    background-color: var(--color-dark-300);
    display: block;
    margin: 8px;
    -webkit-transition: all 0.3s ease-in-out;
    -o-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
  }
  & span:nth-child(1) {
    top: 0px;
    left: 0px;
  }
  & span:nth-child(2) {
    top: 13px;
    left: 0px;
    opacity: 1;
  }
  & span:nth-child(3) {
    bottom: 0px;
    left: 0px;
  }

  ${({ open }) =>
    open
      ? `
    & span:nth-child(1){
      -webkit-transform: translateY(12px) rotate(45deg);
      -ms-transform: translateY(12px) rotate(45deg);
      -o-transform: translateY(12px) rotate(45deg);
      transform: translateY(12px) rotate(45deg);
    }
    & span:nth-child(2){
      opacity: 0;
    }
    & span:nth-child(3){
      -webkit-transform: translateY(-12px) rotate(-45deg);
      -ms-transform: translateY(-12px) rotate(-45deg);
      -o-transform: translateY(-12px) rotate(-45deg);
      transform: translateY(-12px) rotate(-45deg);
    }
  `
      : ``}
`

const Header = ({ dark }: { dark?: boolean }) => {
  const router = useRouter()
  const { account } = useWeb3React()
  const name = useENSName(account)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <HeaderContainer>
      <HeaderMobileWrapper>
        <Link href="/" passHref>
          <Logo dark={dark}>Home</Logo>
        </Link>

        <Hamburger open={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </Hamburger>
      </HeaderMobileWrapper>

      <Nav open={menuOpen}>
        <NavItem>
          <Link href="/discover" passHref>
            <NavLink active={router.route.indexOf('/discover') === 0}>Discover</NavLink>
          </Link>
        </NavItem>
        <NavItem>
          <Link href="/subgraph-editor" passHref>
            <NavLink active={router.route.indexOf('/subgraph-editor') === 0}>
              Subgraph Editor
            </NavLink>
          </Link>
        </NavItem>
        <NavItem>
          <NavLink href="https://docs.cryptostats.community/">Docs</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="https://forum.cryptostats.community/">Forum</NavLink>
        </NavItem>
        <NavItem>
          <Link href="/editor" passHref>
            <Button rel="nofollow" variant="secondary">
              Create Adapter
            </Button>
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
