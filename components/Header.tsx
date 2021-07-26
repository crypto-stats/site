import React from 'react'
import Link from 'next/link';
import styled from 'styled-components'

const Container = styled.header`
  display: flex;
  height: 40px;
  background: gray;
  align-items: space-between;
`

const Nav = styled.nav`
  display: flex;
`

const Header: React.FC = () => {
  return (
    <Container>
      <div>CryptoStats</div>

      <Nav>
        <Link href="/lists"><a>Lists</a></Link>
        <Link href="/adapters"><a>Adapters</a></Link>
        <a href="https://forum.cryptostats.community/">Forum</a>
      </Nav>
    </Container>
  )
}

export default Header
