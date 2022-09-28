import { NextPage } from 'next'
import Head from 'next/head'
import styled from 'styled-components'
import Footer from 'components/Footer'
import Header from 'components/Header'
import RowSection from 'components/RowSection'
import ColumnSection from 'components/ColumnSection'
import SubgraphHero from 'components/subgraph-editor-landing-sections/SubgraphHero'
import Features from 'components/subgraph-editor-landing-sections/Features'
import Link from 'next/link'
import Button from 'components/Button'

const DarkPage = styled.div`
  background-color: #0c0a1d;

  --color-normal-text: #ffffff;
  --color-muted-text: #9d9d9d;

  color: var(--color-normal-text);
`

const HomeBackgroundHead = styled.div`
  padding-bottom: 20px;
`

const CTA = styled.div`
  margin-top: var(--spaces-10);
  padding-bottom: var(--spaces-13);
  display: flex;
  justify-content: center;
`

const SubgraphEditorLanding: NextPage = () => {
  return (
    <>
      <Head>
        <title>Subgraph Editor | CryptoStats</title>
        <meta
          name="description"
          content="It's easy: just publish an adapter or use the Dataset created by the Community to create and view anything you want."
        />
      </Head>
      <DarkPage>
        <HomeBackgroundHead>
          <RowSection>
            <ColumnSection>
              <Header dark />
            </ColumnSection>
          </RowSection>
        </HomeBackgroundHead>

        <SubgraphHero />
        <Features />
        <CTA>
          <Link href="/editor/subgraph">
            <Button>Try it now</Button>
          </Link>
        </CTA>
        <Footer dark />
      </DarkPage>
    </>
  )
}

export default SubgraphEditorLanding
