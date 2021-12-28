import React, { useState, useEffect, Fragment } from 'react'
import { NextPage, GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useENSName } from 'use-ens-name'
import { useWeb3React } from '@web3-react/core'
import { CryptoStatsSDK, Adapter } from '@cryptostats/sdk'
import { Edit } from 'react-feather'
import TranquilLayout from 'components/layouts/TranquilLayout'
import { useAdapterList, newModule } from 'hooks/local-adapters'
import { getListNames, getModulesForList, getListsForAdapter, getCIDFromSlug, getAllVerifiedAdapters } from 'utils/lists-chain'
import AdapterPreviewList from 'components/AdapterPage/AdapterPreviewList'
import Button from 'components/Button'
import CodeViewer from 'components/CodeViewer'
import VerifyForm from 'components/VerifyForm'
import { CompilerProvider } from 'hooks/compiler'
import PublisherBar from 'components/AdapterPage/PublisherBar'
import MetaTags from 'components/MetaTags'
import Text from 'components/Text'
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
  border-radius: 5px;
  background: #FFFFFF;
  border: 1px solid #DDDDDD;
  box-shadow: 0 3px 4px 0 rgba(0,36,75,0.07);
`

const InfoBoxHeader = styled.div`
  padding: 24px;
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

const InfoBoxValue = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: #000000;
  margin: 8px 0 0;
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
const InfoBoxValueFullWidth = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: #000000;
  margin: 8px 0 0;
`

const InfoBoxAuthor = styled.div`
  padding: 24px 24px 32px 24px;
`

const SectionContainer = styled.div`
  margin-top: 40px;
`

const Attribute: React.FC<{ label: string }> = ({ label, children }) => {
  if(label && label === "Author") {
    return (
      <InfoBoxAuthor>
        <Text tag="p" type="label">{label}</Text>
        <Text tag="p" type="content">{children}</Text>
      </InfoBoxAuthor>
    )
  }

  return (
    <InfoBoxItem>
      <Text tag="p" type="label">{label}</Text>
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

const ForkIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
    <path d="M8 7C9.10457 7 10 6.10457 10 5C10 3.89543 9.10457 3 8 3C6.89543 3 6 3.89543 6 5C6 6.10457 6.89543 7 8 7Z" />
    <path d="M8 21C9.10457 21 10 20.1046 10 19C10 17.8954 9.10457 17 8 17C6.89543 17 6 17.8954 6 19C6 20.1046 6.89543 21 8 21Z" />
    <path d="M17 10C18.1046 10 19 9.10457 19 8C19 6.89543 18.1046 6 17 6C15.8954 6 15 6.89543 15 8C15 9.10457 15.8954 10 17 10Z" />
    <path d="M8 7V17" />
    <path d="M17 11V12.8C17 13.1183 16.7893 13.4235 16.4142 13.6485C16.0391 13.8736 15.5304 14 15 14H8"/>
  </svg>
)

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

  const edit = (clone?: boolean) => () => {
    if (!clone) {
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
    }

    plausible('edit-adapter', {
      props: {
        listId,
        adapter: cid,
        adapterName: moduleDetails.name,
        newAdapter: true,
      },
    })

    const newCode = moduleDetails.name
      ? (moduleDetails.sourceCode || moduleDetails.code).replace(moduleDetails.name, `${moduleDetails.name} - Clone`)
      : moduleDetails.sourceCode || moduleDetails.code

    const adapterId = newModule(newCode, [{ cid, version: moduleDetails.version || '0.0.0' }])
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
        title={`${moduleDetails.name || ''} Adapter${listId !== 'adapter' ? ` - ${listId}` : ''}`}
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
            <Text tag="p" type="label">Adapter</Text>
            <Text tag="h1" type="title">
              {moduleDetails.name || cid}
              {_verified && <VerifiedTick />}
            </Text>
            <Text tag="p" type="description">SubAdapters: {subadapters.length}</Text>
          </div>
        }
        sidebar={
          <Fragment>
            <div style={{marginBottom: "24px", display: "flex", justifyContent: "flex-end"}}>
              <Button className="outline" onClick={edit()}>
                <Edit /> Edit Adapter
              </Button>
              <Button className="outline" onClick={edit(true)}>
                <ForkIcon /> Clone Adapter
              </Button>
            </div>
            <DetailsBox>
              <InfoBoxHeader>
                <Text tag="p" type="label">Adapter Info</Text>
              </InfoBoxHeader>
              <InfoBoxGrid>
                <Attribute label="Version">{moduleDetails.version}</Attribute>
                <Attribute label="License">{moduleDetails.license}</Attribute>
                <Attribute label="IPFS CID">{cid}</Attribute>
                <Attribute label="IPFS CID (source)">{moduleDetails.sourceFileCid}</Attribute>
                {moduleDetails.previousVersion && (
                  <Attribute label="Prev. Version">
                    <Link href={`/discover/${listId}/${moduleDetails.previousVersion}`}>
                      <a>{moduleDetails.previousVersion}</a>
                    </Link>
                  </Attribute>
                )}
                {verifiedLists.length > 0 && (
                  <Attribute label="Collections">
                    {verifiedLists.map((list: string) => (
                      <Fragment key={list}>
                        <Link href={`/discover/${list}`} key={list}>
                          <a>{list}</a>
                        </Link>
                        <span>, </span>
                      </Fragment>
                    ))}
                  </Attribute>
                )}
              </InfoBoxGrid>
              {(signer || moduleDetails.signer) && (
                <Attribute label="Author">{signer || moduleDetails.signer}</Attribute>
              )}
            </DetailsBox>


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
        <SectionContainer>
          <Text tag="h2" type="subtitle">Sub-Adapters</Text>
          <Text tag="p" type="description" mt="8">Preview of how the aub-Adapter are returning the data.</Text>
          <AdapterPreviewList staticDetails={subadapters} code={moduleDetails.code} />
        </SectionContainer>
        <SectionContainer>
          <Text tag="h2" type="subtitle">Code</Text>
          <Text tag="p" type="description" mt="8">Check the entire code written for the Adapter.</Text>
          <CodeViewer js={moduleDetails.code} ts={moduleDetails.sourceCode} />    
        </SectionContainer>
      </TranquilLayout>
    </CompilerProvider>
  )
}

export default AdapterPage

export const getStaticProps: GetStaticProps<AdaptersPageProps, { listId: string }> = async (ctx: GetStaticPropsContext) => {
  const collectionId = ctx.params!.listId as string
  let cid = ctx.params!.cid as string

  if (cid.indexOf('Qm') != 0) {
    cid = await getCIDFromSlug(collectionId, cid)
  }

  const sdk = new CryptoStatsSDK({
    executionTimeout: 70,
  })

  const listModules = collectionId === 'adapter' ? [] : await getModulesForList(collectionId)
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
      listId: collectionId,
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
  const adapters = await getAllVerifiedAdapters()

  const paths: any[] = []
  for (const adapter of adapters) {
    paths.push({
      params: {
        listId: adapter.collection,
        cid: adapter.slug || adapter.cid,
      }
    })
  }

  return {
    paths,
    fallback: 'blocking',
  }
}