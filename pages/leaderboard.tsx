import { NextPage, GetStaticProps } from 'next'
import { setRPC, useENSName } from 'use-ens-name'
import styled from 'styled-components'
import { CryptoStatsSDK } from '@cryptostats/sdk'
import TranquilLayout from 'components/layouts/TranquilLayout'
import { getENSCache } from 'utils/ens'

setRPC('https://api.mycryptoapi.com/eth')

const Row = styled.div`
  display: flex;
  height: 30px;
  border-bottom: solid 1px #eeeeee;
  align-items: center;
`

const Col = styled.div<{ flex?: number; min?: number; align?: string }>`
  overflow: hidden;
  ${({ flex }) => (flex ? `flex: ${flex};` : '')}
  ${({ min }) => (min ? `min-width: ${min}px;` : '')}
  ${({ align }) => (align ? `text-align: ${align};` : '')}
  text-overflow: ellipsis;
`

interface Signer {
  id: string
  activeVerifiedAdapters: number
  totalVerifiedAdapters: number
}

const SignerRow: React.FC<{ signer: Signer }> = ({ signer }) => {
  const ensName = useENSName(signer.id)

  return (
    <Row>
      <Col flex={1}>
        <a href={`https://etherscan.io/address/${signer.id}`} target='etherscan'>
          {ensName || signer.id}
        </a>
      </Col>
      <Col min={140} align='right'>
        {signer.activeVerifiedAdapters}
      </Col>
      <Col min={140} align='right'>
        {signer.totalVerifiedAdapters}
      </Col>
    </Row>
  )
}

interface AdaptersPageProps {
  signers: Signer[]
}

const LeaderboardPage: NextPage<AdaptersPageProps> = ({ signers }) => {
  return (
    <TranquilLayout
      hero={
        <div>
          <h1>Leaderboard</h1>
          <p>Which developers have contributed the most adapters?</p>
        </div>
      }
    >
      <div>
        <Row>
          <Col flex={1}>User</Col>
          <Col min={140} align='right'>
            Active Adapters
          </Col>
          <Col min={140} align='right'>
            Total Adapters
          </Col>
        </Row>
        {signers.map(signer => (
          <SignerRow key={signer.id} signer={signer} />
        ))}
      </div>
    </TranquilLayout>
  )
}

export default LeaderboardPage

export const getStaticProps: GetStaticProps<AdaptersPageProps> = async () => {
  const sdk = new CryptoStatsSDK()

  const query = `{
    signers(orderBy: activeVerifiedAdapters, orderDirection:desc) {
      id
      activeVerifiedAdapters
      totalVerifiedAdapters
    }
  }`
  const { signers } = await sdk.graph.query('dmihal/cryptostats-adapter-registry-test', query)

  const ensCache = await getENSCache(signers.map((signer: any) => signer.id))

  return {
    props: {
      signers,
      ensCache,
    },
    revalidate: 1100,
  }
}
