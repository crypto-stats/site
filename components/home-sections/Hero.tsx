import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import HeroCard from './HeroCard'

const Container = styled.div`
  height: 776px;
  display: flex;
  align-items: center;
`

const Column = styled.div`
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
`

const Tagline = styled.div`
  font-size: 52px;
  font-weight: 700;
  color: #272727;
`

const CTA = styled.a`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  border-radius: 4px;
  background: #0477f4;
`

const Hero: React.FC = () => {
  return (
    <Container>
      <Column>
        <Tagline>
          One neutral source of truth for crypto metrics.
          <br />
          Used by everyone, managed by the community.
        </Tagline>

        <Link href="/discover" passHref>
          <CTA>Discover the data collection</CTA>
        </Link>
      </Column>

      <Column>
        <HeroCard title="Uniswap fees" subtitle="Preview">
          <div>Adapter Name</div>
          <div>Uniswap</div>
          <div>Data type</div>
          <div>Fees</div>
          <div>Data</div>
          <div>24 hours fees: $12,000,000</div>
        </HeroCard>
      </Column>
    </Container>
  )
}

export default Hero
