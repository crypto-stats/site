import React, { useState, useEffect, Fragment } from 'react'
import { NextPage, GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useWeb3React } from '@web3-react/core'
import { CryptoStatsSDK, Adapter } from '@cryptostats/sdk'
import TranquilLayout from 'components/layouts/TranquilLayout'
import { useAdapterList, newModule } from 'hooks/local-adapters'
import { getListNames, getModulesForList, getListsForAdapter } from 'utils/lists-chain'
import AdapterPreviewList from 'components/AdapterPage/AdapterPreviewList'
import Button from 'components/Button'
import CodeViewer from 'components/CodeViewer'
import VerifyForm from 'components/VerifyForm'
import { CompilerProvider } from 'hooks/compiler'
import { useENSName } from 'hooks/ens'
import PublisherBar from 'components/AdapterPage/PublisherBar'
import MetaTags from 'components/MetaTags'

const VerifiedTick = styled.span`
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

const Verified = styled.div`
  font-weight: bold;
  color: blue;

  &:before {
    content: '✓';
    display: inline-block;

  }
`

const Unverified = styled.div`
  font-weight: bold;
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
  signer: string | null
  previousVersion: string | null
}

interface AdaptersPageProps {
  listId: string
  cid: string
  verified: boolean
  moduleDetails: ModuleDetails
  subadapters: SubAdapter[]
  listModules: string[]
  verifiedLists: string[]
  collections: string[]
}

const AdapterPage: NextPage<AdaptersPageProps> = ({
  listId, cid, verified, moduleDetails, subadapters, listModules, verifiedLists, collections
}) => {
  const [_verified, setVerified] = useState(verified)
  const { account } = useWeb3React()
  const router = useRouter()
  const adapters = useAdapterList()
  const signer = useENSName(moduleDetails.signer)

  // NextJS page changes might not re-initialize component
  useEffect(() => setVerified(verified), [cid, listId])

  const edit = () => {
    for (const adapter of adapters) {
      for (const publication of adapter.publications || []) {
        if (publication.cid === cid) {
          router.push({
            pathname: '/editor',
            query: { adapter: adapter.id },
          })
          return
        }
      }
    }

    const adapterId = newModule(moduleDetails.sourceCode || moduleDetails.code, [{ cid, version: moduleDetails.version || '0.0.0' }])
    router.push({
      pathname: '/editor',
      query: { adapter: adapterId },
    })
  }

  const isAdmin = account && account.toLowerCase() === process.env.NEXT_PUBLIC_ADMIN_ACCOUNT?.toLowerCase()

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Discover', path: '/discover' },
  ]
  if (listId !== 'adapter') {
    breadcrumbs.push({ name: listId, path: `/discover/${listId}` })
  }

  const subadapterNames = subadapters.map((subadapter: SubAdapter) => subadapter.metadata.name || subadapter.id)

  return (
    <CompilerProvider>
      <MetaTags
        title={`${moduleDetails.name || ''} Adapter - ${listId}`}
        description={`The ${moduleDetails.name || ''} adapter ${moduleDetails.version && `(v${moduleDetails.version})`} contains ${subadapters.length} subadapters: ${subadapterNames.join(', ')}`}
      />

      <TranquilLayout
        notificationBar={!_verified && account?.toLowerCase() === moduleDetails.signer?.toLowerCase() && (
          <PublisherBar
            address={account!}
            collections={collections}
            name={moduleDetails.name}
            version={moduleDetails.version}
            previous={moduleDetails.previousVersion}
          />
        )}
        breadcrumbs={breadcrumbs}
        hero={
          <div>
            <div>Adapter</div>
            <h1>
              {moduleDetails.name || cid}
              {_verified && <VerifiedTick />}
            </h1>
            <div>SubAdapters: {subadapters.length}</div>
          </div>
        }
        sidebar={
          <Fragment>
            <DetailsBox>
              {_verified ? <Verified>Verified adapter</Verified> : <Unverified>Unverified adapter</Unverified>}

              <div>Details</div>
              <div>
                <Attribute label="Version">{moduleDetails.version}</Attribute>
                <Attribute label="License">{moduleDetails.license}</Attribute>
                {(signer || moduleDetails.signer) && (
                  <Attribute label="Signed by">{signer || moduleDetails.signer}</Attribute>
                )}
                {verifiedLists.length > 0 && (
                  <Attribute label="Collections">
                    {verifiedLists.map((list: string) => (
                      <div key={list}>
                        <Link href={`/discover/${list}`}>
                          <a>{list}</a>
                        </Link>
                      </div>
                    ))}
                  </Attribute>
                )}
                <Attribute label="IPFS CID">{cid}</Attribute>
                <Attribute label="IPFS CID (source)">{moduleDetails.sourceFileCid}</Attribute>
                {moduleDetails.previousVersion && (
                  <Attribute label="Previous Version">
                    <Link href={`/discover/${listId}/${moduleDetails.previousVersion}`}>
                      <a>{moduleDetails.previousVersion}</a>
                    </Link>
                  </Attribute>
                )}
              </div>
            </DetailsBox>

            <div>
              <Button onClick={edit}>Edit Adapter</Button>
            </div>

            {isAdmin && listId !== 'adapter' && (
              <div>
                <VerifyForm
                  listId={listId}
                  listModules={listModules}
                  cid={cid}
                  previousVersion={moduleDetails.previousVersion}
                  onVerified={(newVerified: boolean) => setVerified(newVerified)}
                />
              </div>
            )}
          </Fragment>
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

  const verifiedLists = await getListsForAdapter(cid)

  const list = sdk.getList('test')
  const module = await list.fetchAdapterFromIPFS(cid)

  // TODO: only do this if verified
  const subadapters = await Promise.all(list.getAdapters().map(async (adapter: Adapter) => {
    const metadata = await adapter.getMetadata()
    return { id: adapter.id, metadata }
  }))

  const sourceCode = module.sourceFile ? await sdk.ipfs.getFile(module.sourceFile) : null

  const collections = await getListNames()

  const moduleDetails: ModuleDetails = {
    name: module.name,
    version: module.version,
    license: module.license,
    code: module.code!,
    signer: module.signer,
    previousVersion: module.previousVersion,
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
      listModules,
      verifiedLists,
      collections,
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
