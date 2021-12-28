import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import HeroCard from './HeroCard'
import Text from 'components/Text'

const Container = styled.div`
  height: 776px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    margin: 40px 20px;
    height: unset;
  }
`

const Column = styled.div`
  display: flex;
  flex: 1 0 0;
  flex-direction: column;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`

const CardContainer = styled.div`
  position: relative;
  flex: 1 0 0;
  height: 370px;

  @media (max-width: 768px) {
    flex: 1 0 370px;
  }
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

const Label = styled.div`
  font-size: 14px;
  letter-spacing: 1px;
  color: #363636;
  margin-top: 12px;
`

const Attribute = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #363636;
  line-height: 1.75;
`

const Number = styled.span`
  font-size: 16px;
  font-weight: normal;
`

const formatNum = (num: number) => num.toLocaleString('en-US', {
  style: 'currency',
  currency: 'USD',
})

const Hero: React.FC<{ sampleData: any }> = ({ sampleData }) => {
  return (
    <Container>
      <Column>
        <Text tag="h1" type="display">
          One neutral source of truth for crypto metrics.
          <br />
          Used by everyone, managed by the community.
        </Text>

        <Link href="/discover" passHref>
          <CTA>Discover the data collection</CTA>
        </Link>
      </Column>

      <CardContainer>
        <HeroCard title="Gitcoin DAO Treasury" subtitle="Preview" position="TopRight">
          <Label>Adapter Name</Label>
          <Attribute>Gitcoin</Attribute>
          <Label>Data type</Label>
          <Attribute>Treasury</Attribute>
          <Label>Data</Label>
          <Attribute>24 hours fees: <Number>{formatNum(sampleData.gitcoinTreasury)}</Number></Attribute>
        </HeroCard>
        
        <HeroCard title="Yearn Vault APYs" subtitle="Preview" position="Center">
          <Label>Adapter Name</Label>
          <Attribute>Uniswap</Attribute>
          <Label>Data type</Label>
          <Attribute>Fees</Attribute>
          <Label>Data</Label>
          <Attribute>24 hours fees: <Number>{formatNum(sampleData.yearnApy)}</Number></Attribute>
        </HeroCard>

        <HeroCard title="Arbitrum fees" subtitle="Preview" position="BottomLeft">
          <Label>Adapter Name</Label>
          <Attribute>Arbitrum</Attribute>
          <Label>Data type</Label>
          <Attribute>Fees</Attribute>
          <Label>Data</Label>
          <Attribute>24 hours fees: <Number>{formatNum(sampleData.arbitrumFees)}</Number></Attribute>
        </HeroCard>
      </CardContainer>
    </Container>
  )
}

export default Hero
