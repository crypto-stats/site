import React, { useState, useEffect, Fragment } from 'react'
import { NextPage, GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import styled from 'styled-components'
import Link from 'next/link'
import { useENSName, setRPC } from 'use-ens-name'
import { useWeb3React } from '@web3-react/core'
import { Adapter } from '@cryptostats/sdk'
import { Clipboard, History } from 'lucide-react'
import TranquilLayout from 'components/layouts/TranquilLayout'
import {
  getCollectionNames,
  getModulesForCollection,
  getCollectionsForAdapter,
  getCIDFromSlug,
  getAllVerifiedAdapters,
  getPreviousVersions,
  Version,
} from 'utils/lists-chain'
import AdapterPreviewList from 'components/AdapterPage/AdapterPreviewList'
import Button from 'components/Button'
import CodeViewer from 'components/CodeViewer'
import VerifyForm from 'components/VerifyForm'
import { CompilerProvider } from 'hooks/compiler'
import PublisherBar from 'components/AdapterPage/PublisherBar'
import MetaTags from 'components/MetaTags'
import Text from 'components/Text'
import { getENSCache } from 'utils/ens'
import EditModal from 'components/AdapterPage/EditModal'
import SiteModal from 'components/SiteModal'
import HistoryModal from 'components/AdapterPage/HistoryModal'
import Attribute from 'components/AdapterPage/Attribute'
import copy from 'copy-to-clipboard'
import { getSDK } from 'utils/sdk'

setRPC(process.env.NEXT_PUBLIC_ETH_RPC || 'https://mainnet-nethermind.blockscout.com/')

const collectionAdmins = process.env.NEXT_PUBLIC_COLLECTION_ADMINS
  ? JSON.parse(process.env.NEXT_PUBLIC_COLLECTION_ADMINS.toLowerCase())
  : {}

const VerifiedTick = styled.span`
  display: inline-flex;
  background: var(--color-primary);
  height: 20px;
  width: 20px;
  color: white;
  border-radius: 20px;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  margin: 8px;
  align-items: center;
  justify-content: center;

  :before {
    content: '✓';
  }
`

const DetailsBox = styled.div`
  border-radius: 5px;
  background: #ffffff;
  border: 1px solid #dddddd;
  box-shadow: 0 3px 4px 0 rgba(0, 36, 75, 0.07);
`

const InfoBoxHeader = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #d8d8d8;
`

const InfoBoxGrid = styled.div`
  background-color: #f9fafb;
  padding: 24px;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 24px;
    grid-column-gap: 8px;
  }
`

const MiniIconButton = styled.button`
  background: transparent;
  border: none;
  padding: 2px;
  color: #929292;

  &:hover {
    cursor: pointer;
    color: #666666;
  }
  &:active {
    color: #000000;
  }
`

const SectionContainer = styled.div`
  margin-top: 60px;
`

const AdapterActionBtns = styled.div`
  margin-bottom: var(--spaces-4);
  display: flex;
  flex-direction: column;
`

const InfoNumber = styled.span`
  font-weight: 400;
  font-size: 18px;
  color: gray;
`

const AdapterInfo = styled.div`
  margin-top: var(--spaces-6);
`

const CopyButton: React.FC<{ text: string }> = ({ text }) => (
  <MiniIconButton onClick={() => copy(text)}>
    <Clipboard size={16} />
  </MiniIconButton>
)

interface SubAdapter {
  id: string
  metadata: any
}

interface ModuleDetails {
  name: string | null
  version: string | null
  license: string | null
  description: string | null
  code: string
  sourceFileCid: string | null
  sourceCode: string | null
  signer: string | null
  previousVersion: string | null
}

interface AdaptersPageProps {
  collectionId: string
  cid: string
  verified: boolean
  moduleDetails: ModuleDetails
  subadapters: SubAdapter[]
  listModules: string[]
  verifiedLists: string[]
  collections: string[]
  previousVersions: Version[]
}

const AdapterPage: NextPage<AdaptersPageProps> = ({
  collectionId,
  cid,
  verified,
  moduleDetails,
  subadapters,
  listModules,
  verifiedLists,
  collections,
  previousVersions,
}) => {
  const [_verified, setVerified] = useState(verified)
  const { account } = useWeb3React()
  const signer = useENSName(moduleDetails.signer)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showVersions, setShowVersions] = useState(false)

  // NextJS page changes might not re-initialize component
  useEffect(() => {
    setVerified(verified)
    setShowVersions(false)
  }, [cid, collectionId])

  const isAdmin =
    account &&
    (account.toLowerCase() === process.env.NEXT_PUBLIC_ADMIN_ACCOUNT?.toLowerCase() ||
      (collectionAdmins[collectionId] || []).indexOf(account.toLowerCase()) !== -1)

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Discover', path: '/discover' },
  ]
  if (collectionId !== 'adapter') {
    breadcrumbs.push({ name: collectionId, path: `/discover/${collectionId}` })
  }

  const subadapterNames = subadapters.map(
    (subadapter: SubAdapter) => subadapter.metadata.name || subadapter.id
  )

  return (
    <CompilerProvider>
      <MetaTags
        title={`${moduleDetails.name || ''} Adapter${
          collectionId !== 'adapter' ? ` - ${collectionId}` : ''
        }`}
        description={`The ${moduleDetails.name || ''} adapter ${
          moduleDetails.version && `(v${moduleDetails.version})`
        } contains ${subadapters.length} subadapters: ${subadapterNames.join(', ')}`}
      />

      <TranquilLayout
        page="adapter"
        notificationBar={
          !_verified &&
          account?.toLowerCase() === moduleDetails.signer?.toLowerCase() && (
            <PublisherBar
              address={account!}
              collections={collections}
              name={moduleDetails.name}
              version={moduleDetails.version}
              previous={moduleDetails.previousVersion}
            />
          )
        }
        breadcrumbs={breadcrumbs}
        hero={
          <AdapterInfo>
            <Text tag="p" type="label">
              Adapter
            </Text>
            <Text tag="h1" type="title" mt="8" mb="16">
              {moduleDetails.name || cid}
              {_verified && <VerifiedTick />}
            </Text>
            {moduleDetails.description && (
              <Text tag="h2" type="description">
                {moduleDetails.description}
              </Text>
            )}
          </AdapterInfo>
        }
        sidebar={
          <Fragment>
            <AdapterActionBtns>
              <Button
                variant="outline"
                onClick={() => setShowEditModal(true)}
                icon="Edit"
                fullWidth
              >
                Edit/Fork
              </Button>
            </AdapterActionBtns>
            <DetailsBox>
              <InfoBoxHeader>
                <Text tag="p" type="label">
                  Adapter Info
                </Text>
              </InfoBoxHeader>
              <InfoBoxGrid>
                <Attribute label="Version">{moduleDetails.version}</Attribute>
                <Attribute label="License">{moduleDetails.license}</Attribute>
                <Attribute label="IPFS CID" buttons={<CopyButton text={cid} />}>
                  {cid}
                </Attribute>
                <Attribute
                  label="CID (source)"
                  buttons={<CopyButton text={moduleDetails.sourceFileCid!} />}
                >
                  {moduleDetails.sourceFileCid}
                </Attribute>
                {moduleDetails.previousVersion && (
                  <Attribute
                    label="Prev. Version"
                    buttons={
                      <>
                        <CopyButton text={moduleDetails.previousVersion} />
                        <MiniIconButton onClick={() => setShowVersions(true)}>
                          <History size={16} />
                        </MiniIconButton>
                      </>
                    }
                  >
                    <Link href={`/discover/${collectionId}/${moduleDetails.previousVersion}`}>
                      <a>{moduleDetails.previousVersion}</a>
                    </Link>
                  </Attribute>
                )}
                {verifiedLists.length > 0 && (
                  <Attribute label="Collections">
                    {verifiedLists.map((list: string, i: number) => (
                      <Fragment key={list}>
                        <Link href={`/discover/${list}`} key={list}>
                          <a>{list}</a>
                        </Link>
                        {i !== verifiedLists.length - 1 && ', '}
                      </Fragment>
                    ))}
                  </Attribute>
                )}
              </InfoBoxGrid>
              {(signer || moduleDetails.signer) && (
                <Attribute label="Author">{signer || moduleDetails.signer}</Attribute>
              )}
            </DetailsBox>

            {isAdmin && collectionId !== 'adapter' && (
              <div>
                <VerifyForm
                  listId={collectionId}
                  listModules={listModules}
                  cid={cid}
                  previousVersion={moduleDetails.previousVersion}
                  onVerified={(newVerified: boolean) => setVerified(newVerified)}
                  previousVersions={previousVersions}
                />
              </div>
            )}
          </Fragment>
        }
      >
        <SectionContainer>
          <Text tag="h3" type="subtitle">
            Sub-Adapters <InfoNumber>{subadapters.length}</InfoNumber>
          </Text>
          <Text tag="p" type="description" mt="8">
            Preview and test each sub adapter.
          </Text>
          <AdapterPreviewList staticDetails={subadapters} code={moduleDetails.code} />
        </SectionContainer>
        <SectionContainer>
          <Text tag="h3" type="subtitle">
            Adapter Code
          </Text>
          <Text tag="p" type="description" mt="8">
            Check the entire code written for the Adapter.
          </Text>
          <CodeViewer js={moduleDetails.code} ts={moduleDetails.sourceCode} />
        </SectionContainer>
        <div>
          <Text tag="h3" type="subtitle" mt="100" align="center">
            It's something off?
          </Text>
          <Text tag="p" type="description" mt="16" mb="24" align="center">
            Report it to the discussion board on Discord, we will take care of it.
          </Text>
          <Link href="https://discord.gg/ZunfyPuB6A">
            <Button centered>Join Discord Community</Button>
          </Link>
        </div>
      </TranquilLayout>

      <EditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        cid={cid}
        collectionId={collectionId}
        moduleDetails={moduleDetails}
      />
      <SiteModal
        title="Adapter History"
        isOpen={showVersions}
        onClose={() => setShowVersions(false)}
      >
        <HistoryModal historicalVersions={previousVersions} currentCID={cid} />
      </SiteModal>
    </CompilerProvider>
  )
}

export default AdapterPage

export const getStaticProps: GetStaticProps<AdaptersPageProps, { collectionId: string }> = async (
  ctx: GetStaticPropsContext
) => {
  const collectionId = ctx.params!.collectionId as string
  let cid = ctx.params!.cid as string

  if (cid.indexOf('Qm') != 0) {
    cid = await getCIDFromSlug(collectionId, cid)
  }
  if (!cid) {
    return {
      revalidate: 15,
      notFound: true,
    }
  }

  const sdk = getSDK()

  const listModules = collectionId === 'adapter' ? [] : await getModulesForCollection(collectionId)
  const verified = listModules.indexOf(cid) !== -1

  const verifiedLists = await getCollectionsForAdapter(cid)

  const list = sdk.getCollection('test')
  const module = await list.fetchAdapterFromIPFS(cid)

  // TODO: only do this if verified
  const subadapters = await Promise.all(
    list.getAdapters().map(async (adapter: Adapter) => {
      const metadata = await adapter.getMetadata()
      return { id: adapter.id, metadata }
    })
  )

  const sourceCode = module.sourceFile ? await sdk.ipfs.getFile(module.sourceFile) : null

  const collections = await getCollectionNames()

  const previousVersions = await getPreviousVersions(cid)

  const moduleDetails: ModuleDetails = {
    name: module.name,
    version: module.version,
    license: module.license,
    code: module.code!,
    signer: module.signer,
    previousVersion: module.previousVersion,
    sourceFileCid: module.sourceFile,
    description:
      module.description ||
      (subadapters.length === 1 && subadapters[0].metadata.description) ||
      null,
    sourceCode,
  }

  const ensCache = module.signer ? await getENSCache([module.signer]) : []

  return {
    props: {
      collectionId,
      cid,
      verified,
      moduleDetails,
      subadapters,
      listModules,
      verifiedLists,
      collections,
      ensCache,
      previousVersions,
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
        collectionId: adapter.collection,
        cid: adapter.slug || adapter.cid,
      },
    })
  }

  return {
    paths,
    fallback: 'blocking',
  }
}
