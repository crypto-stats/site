import { NextPage } from 'next'
import Head from 'next/head'
import styled from 'styled-components'
import Header from 'components/Header'
import Footer from 'components/Footer'
import HeroHowItWorks from 'components/home-sections/HeroHowItWorks'
import RowSection from 'components/RowSection'
import ColumnSection from 'components/ColumnSection'
import Text from 'components/Text'

const HeaderBackground = styled.div`
  background-image: url('hiw_bg_head.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding-bottom: 150px;
`

const Image = styled.img`
  width: 100%;
  height: auto;
`

const HowItWorks: NextPage = () => {
  return (
    <>
      <Head>
        <title>How it works | CryptoStats</title>
        <meta
          name="description"
          content="One neutral source of truth for crypto metrics. Used by everyone, managed by the community."
        />
      </Head>
      <HeaderBackground>
        <RowSection>
          <ColumnSection>
            <Header />
          </ColumnSection>
        </RowSection>
        <HeroHowItWorks />
      </HeaderBackground>

      <RowSection alignItems="center">
        <ColumnSection from="2" to="6">
          <Text tag="h3" type="title_highlight" mb="24">
            Code &amp; Publish Adapters.
          </Text>
          <Text tag="p" type="content_big" mb="16">
            Using the CryptoStats online, in browser, javascript editor (1) it's all you need to
            write and test your adapter. Choose from pre-made templates to speed up your coding or
            use our powerfull SDK for easy pulling of data from different sources.{' '}
          </Text>
          <Text tag="p" type="content_big" mb="16">
            Then Publish and Sign your adapter with your ETH Wallet (2) to publish it on IPFS (3)
            and you are all set!{' '}
          </Text>
        </ColumnSection>
        <ColumnSection from="7" to="12">
          <Image src="image-howitworks_phase-01.png" alt="How Cryptostats works" />
        </ColumnSection>
      </RowSection>

      <RowSection alignItems="center" mt="120">
        <ColumnSection from="2" to="7">
          <Image src="image-howitworks_phase-02.png" alt="How Cryptostats works" />
        </ColumnSection>
        <ColumnSection from="8" to="12">
          <Text tag="h3" type="title_highlight" mb="24">
            Add Adapters into Collections.
          </Text>
          <Text tag="p" type="content_big" mb="16">
            The Adapter developer requests the addition of it's own adapter to the Delegates (5), a
            special group of people voted by the community, which will test, verify, approve (6) and
            add the Adapter hash to the Collection Registry Smart contract (7).
          </Text>
          <Text tag="p" type="content_big" mb="16">
            Once done, the Adapter will be listed to the Collections and the Dataset available to be
            used.
          </Text>
        </ColumnSection>
      </RowSection>

      <RowSection alignItems="center" mt="120" mb="140">
        <ColumnSection from="2" to="6">
          <Text tag="h3" type="title_highlight" mb="24">
            Use Collection Dataset.
          </Text>
          <Text tag="p" type="content_big" mb="16">
            Minimal tech knowledge is required to use the Dataset provided by the Community. It's
            free and easy with our REST API or the Javascript SDK (8).
          </Text>
          <Text tag="p" type="content_big" mb="16">
            What's happen behind the scene?.
          </Text>
          <Text tag="p" type="content_big" mb="16">
            The list of Adapters will be fetch from the Collection Registry Smart Contract (9) and
            the correspondant Adapter code downloaded (10). Then the actual query will be made from
            the indexers and data will be available to use into your project (11) — (It's easier
            than it sounds!)
          </Text>
        </ColumnSection>
        <ColumnSection from="7" to="12">
          <Image src="image-howitworks_phase-03.png" alt="How Cryptostats works" />
        </ColumnSection>
      </RowSection>

      <Footer />
    </>
  )
}

export default HowItWorks
