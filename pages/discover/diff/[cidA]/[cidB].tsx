import React from 'react'
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, NextPage } from 'next'
import { CryptoStatsSDK } from '@cryptostats/sdk'
import DiffViewer from "components/DiffViewer"
import RowSection from 'components/RowSection'
import ColumnSection from 'components/ColumnSection'
import Header from 'components/Header'
import Head from 'next/head'
import Footer from 'components/Footer'
import styled from 'styled-components'

const DiffContainer = styled.div`
  margin: 20px 4px;
`

interface DiffPageProps {
  fileA: string | null
  fileB: string | null
}

const DiffPage: NextPage<DiffPageProps> = ({ fileA, fileB }) => {
  if (!fileA || !fileB) {
    return (
      <div>Could not load source code</div>
    )
  }

  return (
    <>
      <Head>
        <title>Diff | CryptoStats</title>
      </Head>
      <RowSection>
        <ColumnSection>
          <Header />
        </ColumnSection>
      </RowSection>

      <DiffContainer>
        <DiffViewer
          fileA={fileA}
          fileB={fileB}
        />
      </DiffContainer>
      <Footer />
    </>
      )
    }

    export default DiffPage


export const getStaticProps: GetStaticProps<DiffPageProps, { cidA: string, cidB: string }> = async (ctx: GetStaticPropsContext) => {
  const cidA = ctx.params!.cidA as string
  const cidB = ctx.params!.cidB as string

  const sdk = new CryptoStatsSDK({
    executionTimeout: 70,
  })

  const collectionA = sdk.getCollection('testA')
  const collectionB = sdk.getCollection('testB')
  const [moduleA, moduleB] = await Promise.all([
    collectionA.fetchAdapterFromIPFS(cidA),
    collectionB.fetchAdapterFromIPFS(cidB),
  ])

  const [fileA, fileB] = await Promise.all([
    moduleA.sourceFile ? await sdk.ipfs.getFile(moduleA.sourceFile) : null,
    moduleB.sourceFile ? await sdk.ipfs.getFile(moduleB.sourceFile) : null,
  ])

  console.log({fileA, fileB})

  return {
    props: {
      fileA,
      fileB,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}
