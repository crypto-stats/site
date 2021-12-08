import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import HeroCard from './HeroCard'

const Container = styled.div`
  height: 776px;
  display: flex;
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    margin: 40px 20px;
  }
`

const Column = styled.div`
  display: flex;
  flex: 1 0 0;
  flex-direction: column;

  @media (min-width: 768px) {
    margin-bottom: 20px;
  }
`

const CardContainer = styled.div`
  position: relative;
  flex: 1 0 0;
  height: 370px;
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
  line-height: 54px;
  display: block;
  align-self: flex-start;
  padding: 0 30px;
  text-decoration: none;
  margin-top: 40px;

  &:hover {
    background: #278efc;
  }
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

      <CardContainer>
        <HeroCard title="Uniswap fees" subtitle="Preview" position="TopRight">
          <div>Adapter Name</div>
          <div>Uniswap</div>
          <div>Data type</div>
          <div>Fees</div>
          <div>Data</div>
          <div>24 hours fees: $12,000,000</div>
        </HeroCard>
        
        <HeroCard title="Uniswap fees" subtitle="Preview" position="Center">
          <div>Adapter Name</div>
          <div>Uniswap</div>
          <div>Data type</div>
          <div>Fees</div>
          <div>Data</div>
          <div>24 hours fees: $12,000,000</div>
        </HeroCard>

        <HeroCard title="Uniswap fees" subtitle="Preview" position="BottomLeft">
          <div>Adapter Name</div>
          <div>Uniswap</div>
          <div>Data type</div>
          <div>Fees</div>
          <div>Data</div>
          <div>24 hours fees: $12,000,000</div>
        </HeroCard>
      </CardContainer>
    </Container>
  )
}

export default Hero
