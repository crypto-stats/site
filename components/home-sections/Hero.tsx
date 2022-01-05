import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import HeroCard from './HeroCard'
import Text from 'components/Text'
import RowSection from 'components/RowSection'
import ColumnSection from 'components/ColumnSection'
import Button from 'components/Button';


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
    <RowSection mt="64">
      <ColumnSection columns="6">
        <Text tag="h1" type="display" mb="40">
          One neutral source of truth for crypto metrics. Used by everyone, managed by the community.
        </Text>

        <Link href="/discover" passHref>
          <Button>Discover the data collection</Button>
        </Link>
      </ColumnSection>

      <ColumnSection from="8" to="13" hideSmall>
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
      </ColumnSection>
    </RowSection>
  )
}

export default Hero
