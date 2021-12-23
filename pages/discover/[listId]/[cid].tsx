import React, { useState, useEffect, Fragment } from 'react'
import { NextPage, GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useENSName } from 'use-ens-name'
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
import PublisherBar from 'components/AdapterPage/PublisherBar'
import MetaTags from 'components/MetaTags'
import { getENSCache } from 'utils/ens'
import { usePlausible } from 'next-plausible'

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
  margin: 8px;

  :before {
    content: '✓';
  }
`

const DetailsBox = styled.div`
  // padding: 24px;
  border-radius: 5px;
  background: #FFFFFF;
  border: 1px solid #DDDDDD;
  box-shadow: 0 3px 4px 0 rgba(0,36,75,0.07);
`

const InfoBoxHeader = styled.div`
  font-family: Inter-Regular;
  font-size: 12px;
  color: #838383;
  letter-spacing: 2px;
  padding: 24px;
  text-transform: uppercase;
  border-bottom: 1px solid #D8D8D8;
`

const InfoBoxGrid = styled.div`
  background-color: #F9FAFB;
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 24px;
`

const InfoBoxItem = styled.div`
  margin: 0;
  padding: 0;
`

const InfoBoxLabel = styled.div`
  display: block;
  font-family: Inter-Regular;
  font-size: 12px;
  color: #4B4B4B;
  letter-spacing: 0.34px;
  text-transform: uppercase;
  `

const InfoBoxValue = styled.div`
  font-family: Inter-Medium;
  font-size: 14px;
  color: #000000;
  margin: 8px 0 0;
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
const InfoBoxValueFullWidth = styled.div`
  font-family: Inter-Medium;
  font-size: 14px;
  color: #000000;
  margin: 8px 0 0;
`

const InfoBoxAuthor = styled.div`
  padding: 24px 24px 32px 24px;
`
const InfoBoxAuthorLabel = styled(InfoBoxLabel)``
const InfoBoxAuthorValue = styled.div`
  display: inline;
  padding: 12px;
  background-color: #EEF1F7;
  border-radius: 4px;
  width: auto;
  margin-top: 16px;
  font-family: Inter-Medium;
  font-size: 14px;
  color: #0477F4;

  &:hover{
    cursor: pointer;
  }
`

const Attribute: React.FC<{ label: string }> = ({ label, children }) => {
  if(label && label === "Author") {
    return (
      <InfoBoxAuthor>
        <InfoBoxAuthorLabel>{label}</InfoBoxAuthorLabel>
        <InfoBoxAuthorValue>{children}</InfoBoxAuthorValue>
      </InfoBoxAuthor>
    )
  }

  return (
    <InfoBoxItem>
      <InfoBoxLabel>{label}</InfoBoxLabel>
      {label === "Collections"? <InfoBoxValueFullWidth>{children}</InfoBoxValueFullWidth> : <InfoBoxValue>{children}</InfoBoxValue>}
    </InfoBoxItem>
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
  const plausible = usePlausible()
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
          plausible('edit-adapter', {
            props: {
              listId,
              adapter: cid,
              adapterName: moduleDetails.name,
              newAdapter: false,
            },
          })

          router.push({
            pathname: '/editor',
            query: { adapter: adapter.id },
          })
          return
        }
      }
    }


    plausible('edit-adapter', {
      props: {
        listId,
        adapter: cid,
        adapterName: moduleDetails.name,
        newAdapter: true,
      },
    })

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
              {/* {_verified ? <Verified>Verified adapter</Verified> : <Unverified>Unverified adapter</Unverified>} */}

              <InfoBoxHeader>Adapter Info</InfoBoxHeader>
              <InfoBoxGrid>
                <Attribute label="Version">{moduleDetails.version}</Attribute>
                <Attribute label="License">{moduleDetails.license}</Attribute>
                <Attribute label="IPFS CID">{cid}</Attribute>
                <Attribute label="IPFS CID (source)">{moduleDetails.sourceFileCid}</Attribute>
                {verifiedLists.length > 0 && (
                  <Attribute label="Collections">
                    {verifiedLists.map((list: string) => (
                      <>
                        <Link href={`/discover/${list}`} key={list}>
                          <a>{list}</a>
                        </Link>
                        <span>, </span>
                      </>
                    ))}
                  </Attribute>
                )}
                {moduleDetails.previousVersion && (
                  <Attribute label="Previous Version">
                    <Link href={`/discover/${listId}/${moduleDetails.previousVersion}`}>
                      <a>{moduleDetails.previousVersion}</a>
                    </Link>
                  </Attribute>
                )}
              </InfoBoxGrid>
              {(signer || moduleDetails.signer) && (
                <Attribute label="Author">{signer || moduleDetails.signer}</Attribute>
              )}
            </DetailsBox>

            <div style={{marginTop: "24px"}}>
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

  const ensCache = module.signer ? await getENSCache([module.signer]) : []

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
      ensCache,
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