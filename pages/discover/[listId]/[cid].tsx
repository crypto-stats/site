import { NextPage, GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import styled from 'styled-components'
import { CryptoStatsSDK, Adapter } from '@cryptostats/sdk'
import TranquilLayout from 'components/layouts/TranquilLayout'
import { getListNames, getModulesForList } from 'utils/lists'
import AdapterPreviewList from 'components/AdapterPreviewList'
import CodeViewer from 'components/CodeViewer'
import { CompilerProvider } from 'hooks/compiler'

const Verified = styled.span`
  display: inline-block;
  background: #6060ff;
  height: 30px;
  width: 30px;
  color: white;
  border-radius: 20px;
  text-align: center;
  line-height: 30px;
  font-size: 20px;

  :before {
    content: '✓';
  }
`

const DetailsBox = styled.div`
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 3px 4px 0 rgba(0, 36, 75, 0.07);
  border: solid 1px #ddd;
  background-color: #ffffff;
`

const Column = styled.div`
  display: flex;
  margin: 10px 0;
`

const Row = styled.div`
  flex: 1 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Attribute: React.FC<{ label: string }> = ({ label, children }) => {
  return (
    <Column>
      <Row>{label}</Row>
      <Row>{children}</Row>
    </Column>
  )
}

interface SubAdapter {
  id: string
  metadata: any
}

interface ModuleDetails {
  name: string | null
  version: string | null
  license: string | null
  code: string
  sourceFileCid: string | null
  sourceCode: string | null
}

interface AdaptersPageProps {
  listId: string
  cid: string
  verified: boolean
  moduleDetails: ModuleDetails
  subadapters: SubAdapter[]
}

const AdapterPage: NextPage<AdaptersPageProps> = ({ /*listId,*/ cid, verified, moduleDetails, subadapters }) => {
  return (
    <CompilerProvider>
      <TranquilLayout
        hero={
          <div>
            <div>Adapter</div>
            <h1>
              {moduleDetails.name || cid}
              {verified && <Verified />}
            </h1>
            <div>SubAdapters: {subadapters.length}</div>
          </div>
        }
        sidebar={
          <DetailsBox>
            <div>Details</div>
            <div>
              <Attribute label="Version">{moduleDetails.version}</Attribute>
              <Attribute label="License">{moduleDetails.license}</Attribute>
              <Attribute label="IPFS CID">{cid}</Attribute>
              <Attribute label="IPFS CID (source)">{moduleDetails.sourceFileCid}</Attribute>
            </div>
          </DetailsBox>
        }
      >
        <h2>Sub-Adapters</h2>
        <AdapterPreviewList staticDetails={subadapters} code={moduleDetails.code} />
        
        <h2>Code</h2>
        <CodeViewer js={moduleDetails.code} ts={moduleDetails.sourceCode} />    
      </TranquilLayout>
    </CompilerProvider>
  )
}

export default AdapterPage

export const getStaticProps: GetStaticProps<AdaptersPageProps, { listId: string }> = async (ctx: GetStaticPropsContext) => {
  const listId = ctx.params!.listId as string
  const cid = ctx.params!.cid as string

  const sdk = new CryptoStatsSDK({})

  const listModules = listId === 'adapter' ? [] : await getModulesForList(listId)
  const verified = listModules.indexOf(cid) !== -1

  const list = sdk.getList('test')
  const module = await list.fetchAdapterFromIPFS(cid)

  // TODO: only do this if verified
  const subadapters = await Promise.all(list.getAdapters().map(async (adapter: Adapter) => {
    const metadata = await adapter.getMetadata()
    return { id: adapter.id, metadata }
  }))

  const sourceCode = module.sourceFile ? await sdk.ipfs.getFile(module.sourceFile) : null

  const moduleDetails: ModuleDetails = {
    name: module.name,
    version: module.version,
    license: module.license,
    code: module.code!,
    sourceFileCid: module.sourceFile,
    sourceCode,
  }

  return {
    props: {
      listId,
      cid,
      verified,
      moduleDetails,
      subadapters,
    },
    revalidate: 60,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const listNames = await getListNames()

  const paths: any[] = []
  await Promise.all(listNames.map(async (listId: string) => {
    const cids = await getModulesForList(listId)
    for (const cid of cids) {
      paths.push({ params: { listId, cid } })
    }
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}
