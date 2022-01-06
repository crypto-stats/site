import { getSDK } from 'utils/sdk'
import styled from 'styled-components'
import Footer from 'components/Footer'
import Header from 'components/Header'
import Description from 'components/home-sections/Description'
import Hero from 'components/home-sections/Hero'
import Actions from 'components/home-sections/Actions'
import { GetStaticProps, NextPage } from 'next'
import FAQs from 'components/home-sections/FAQs'
import Investors from 'components/home-sections/Investors'
import Users from 'components/home-sections/Users'
import Dao from 'components/home-sections/Dao'
import RowSection from 'components/RowSection'
import ColumnSection from 'components/ColumnSection'

const HomeBackgroundHead = styled.div`
  background-image: url('hp_bg_head.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding-bottom: 200px;
`
const HomeBackgroundActions = styled.div`
  margin-top: var(--spaces-10);
  background-image: url('hp_bg_actions.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding-bottom: var(--spaces-13);
`
interface HomePageProps {
  sampleData: any
}

const Home: NextPage<HomePageProps> = ({ sampleData }) => {
  return (
    <>
      <HomeBackgroundHead>
        <RowSection>
          <ColumnSection>
            <Header />
          </ColumnSection>
        </RowSection>
        <Hero sampleData={sampleData} />
      </HomeBackgroundHead>
      <Description />
      <HomeBackgroundActions>
        <Actions />
      </HomeBackgroundActions>
      <Investors />
      <Users />
      <Dao />
      <FAQs />
      <Footer />
    </>
  )
}

export default Home

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {

  const sdk = getSDK()
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
    arbitrum.executeQuery('oneDayTotalFees', yesterday).catch(() => 145_932.31),
    yearn.executeQuery('apyPrevious30Days', dai).catch(() => 0.05123),
    gitcoin.executeQuery('currentTreasuryUSD').catch(() => 564507541.7869024),
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
