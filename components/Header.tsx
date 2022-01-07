import React, { useState } from 'react'
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
  display: flex;

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

const Nav = styled.nav<{ open: boolean }>`
  display: inline-grid;
  grid-template-columns: repeat(4, min-content);
  grid-gap: 0 var(--spaces-3);
  align-items: center;
  justify-self: end;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100px;
    left: 0;
    right: 0;
    overflow: hidden;
    background: white;
    transition: 500ms height;
    height: ${({ open }) => open ? '260px' : '0'};
    z-index: 10;
  }
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

  @media (max-width: 768px) {
    margin: 20px 0;
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

const Hamburger = styled.button<{ open: boolean }>`
  width: 35px;
  height: 30px;
  margin: 10px 10px;
  position: relative;
  cursor: pointer;
  display: inline-block;
  border: none;
  background: transparent;
  outline: none;

  @media (min-width: 700px) {
    display: none;
  }

  & span {
    background: #000;
    position: absolute;
    border-radius: 2px;
    transition: .3s cubic-bezier(.8, .5, .2, 1.4);
    width: 100%;
    height: 4px;
    transition-duration: 500ms;
  }
  & span:nth-child(1){
    top: 0px;
    left: 0px;
  }
  & span:nth-child(2){
    top: 13px;
    left: 0px;
    opacity: 1;
  }
  & span:nth-child(3){
    bottom: 0px;
    left: 0px;
  }
  ${({ open }) => open ? `
    & span:nth-child(1){
      transform: rotate(45deg);
      top: 13px;
    }
    & span:nth-child(2){
      opacity: 0;
    }
    & span:nth-child(3){
      transform: rotate(-45deg);
      top: 13px;
    }
  ` : `
    &:hover span:nth-child(1){
      transform: rotate(-3deg) scaleY(1.1);
    }
    &:hover span:nth-child(2){
      transform: rotate(3deg) scaleY(1.1);
    }
    &:hover span:nth-child(3){
      transform: rotate(-4deg) scaleY(1.1);
    }
  `}
`

const Header: React.FC = () => {
  const router = useRouter()
  const { account } = useWeb3React()
  const name = useENSName(account)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <HeaderContainer>
      <Link href="/" passHref>
        <Logo>Home</Logo>
      </Link>

      <Hamburger open={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </Hamburger>

      <Nav open={menuOpen}>
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
