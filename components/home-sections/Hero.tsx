import React from 'react'
import Link from 'next/link'
import HeroCard from './HeroCard'
import Text from 'components/Text'
import RowSection from 'components/RowSection'
import ColumnSection from 'components/ColumnSection'
import Button from 'components/Button';

const formatNum = (num: number) => num.toLocaleString('en-US', {
  style: 'currency',
  currency: 'USD',
})

const Hero: React.FC<{ sampleData: any }> = ({ sampleData }) => {
  return (
    <RowSection mt="140">
      <ColumnSection columns="6">
        <Text tag="h1" type="display" mb="40">
          One neutral source of truth for crypto metrics. Used by everyone, managed by the community.
        </Text>
        <Link href="/discover" passHref>
          <Button>Discover the data collection</Button>
        </Link>
      </ColumnSection>

      <ColumnSection from="8" to="13" hideSmall>
        <HeroCard title="Gitcoin DAO Treasury" subtitle="Preview" position="TopRight" icon="gitcoin">
          <Text tag="p" type="label" mt="16" mb="8">Adapter Name</Text>
          <Text tag="p" type="content">Gitcoin</Text>
          <Text tag="p" type="label" mt="16" mb="8">Data type</Text>
          <Text tag="p" type="content">Treasury</Text>
          <Text tag="p" type="label" mt="16" mb="8">Data</Text>
          <Text tag="p" type="content">24 hours fees: {formatNum(sampleData.gitcoinTreasury)}</Text>
        </HeroCard>
        
        <HeroCard title="Yearn Vault APYs" subtitle="Preview" position="Center" icon="yearn">
          <Text tag="p" type="label" mt="16" mb="8">Adapter Name</Text>
          <Text tag="p" type="content">Uniswap</Text>
          <Text tag="p" type="label" mt="16" mb="8">Data type</Text>
          <Text tag="p" type="content">Fees</Text>
          <Text tag="p" type="label" mt="16" mb="8">Data</Text>
          <Text tag="p" type="content">24 hours fees: {formatNum(sampleData.yearnApy)}</Text>
        </HeroCard>

        <HeroCard title="Arbitrum fees" subtitle="Preview" position="BottomLeft" icon="arbitrum">
          <Text tag="p" type="label" mt="16" mb="8">Adapter Name</Text>
          <Text tag="p" type="content">Arbitrum</Text>
          <Text tag="p" type="label" mt="16" mb="8">Data type</Text>
          <Text tag="p" type="content">Fees</Text>
          <Text tag="p" type="label" mt="16" mb="8">Data</Text>
          <Text tag="p" type="content">24 hours fees: {formatNum(sampleData.arbitrumFees)}</Text>
        </HeroCard>
      </ColumnSection>
    </RowSection>
  )
}

export default Hero
