import styled from 'styled-components'
import { CryptoStatsSDK } from '@cryptostats/sdk'
import Footer from 'components/Footer'
import Header from 'components/Header'
import Description from 'components/home-sections/Description'
import Hero from 'components/home-sections/Hero'
import Actions from 'components/home-sections/Actions'
import { GetStaticProps, NextPage } from 'next'
import FAQs from 'components/home-sections/FAQs'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Column = styled.div`
  max-width: 1248px;
  width: calc(100% - 12px);
`

interface HomePageProps {
  sampleData: any
}

const Home: NextPage<HomePageProps> = ({ sampleData }) => {
  return (
    <Container>
      <Column>
        <Header />

        <Hero sampleData={sampleData} />

        <Description />

        <Actions />

        <FAQs />
      </Column>

      <Footer />
    </Container>
  )
}

export default Home

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {

  const sdk = new CryptoStatsSDK({
    moralisKey: process.env.NEXT_PUBLIC_MORALIS_KEY,
    adapterListSubgraph: 'dmihal/cryptostats-adapter-registry-test',
  })
  const yesterday = sdk.date.offsetDaysFormatted(sdk.date.formatDate(new Date()), -1)

  const feesList = sdk.getList('fees')
  const apyList = sdk.getList('apy-current')
  const treasuryList = sdk.getList('treasuries')

  await Promise.all([
    feesList.fetchAdapters(),
    apyList.fetchAdapters(),
    treasuryList.fetchAdapters(),
  ])

  const arbitrum = feesList.getAdapter('arbitrum-one')
  const yearn = apyList.getAdapter('yearn-vaults')
  const gitcoin = treasuryList.getAdapter('gitcoin')

  const dai = '0x6b175474e89094c44da98b954eedeac495271d0f'

  const [arbitrumFees, yearnApy, gitcoinTreasury] = await Promise.all([
    arbitrum.executeQuery('oneDayTotalFees', yesterday),
    yearn.executeQuery('apyPrevious30Days', dai),
    gitcoin.executeQuery('currentTreasuryUSD'),
  ])

  const sampleData = {
    arbitrumFees,
    yearnApy,
    gitcoinTreasury,
  }

  return {
    props: {
      sampleData,
    },
    revalidate: 60 * 60,
  }
}
