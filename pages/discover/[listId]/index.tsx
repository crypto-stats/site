import { NextPage, GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import { CryptoStatsSDK, Adapter } from '@cryptostats/sdk'
import TranquilLayout from 'components/layouts/TranquilLayout'
import CardList from 'components/CardList'
import { getListNames, getModulesForList } from 'utils/lists-chain'

interface SubAdapter {
  id: string
  name: string
  icon: string | null
}

interface AdapterData {
  cid: string
  name: string
  subadapters: SubAdapter[]
}

interface ListPageProps {
  listId: string,
  adapters: AdapterData[]
  subadapters: SubAdapter[]
}

const DiscoverPage: NextPage<ListPageProps> = ({ adapters, subadapters, listId }) => {
  const listItems = adapters.map((adapter: AdapterData) => ({
    title: adapter.name,
    description: 'Lorem ipsum',
    metadata: [`${adapter.subadapters.length} subadapters`],
    iconlist: adapter.subadapters.map((subadapter: SubAdapter) => ({
      path: subadapter.icon || '', // TODO placeholder
      title: subadapter.name,
    })),
    link: `/discover/${listId}/${adapter.cid}`,
  }))

  return (
    <TranquilLayout
      hero={
        <div>
          <h1>{listId}</h1>
          <p>The most valuable crypto metrics, currated and managed by the community</p>
          <div>Adapters: {adapters.length} - SubAdapters: {subadapters.length}</div>
        </div>
      }
    >
      <div>
        <CardList items={listItems} />
      </div>
    </TranquilLayout>
  )
}

export default DiscoverPage

export const getStaticProps: GetStaticProps<ListPageProps, { listId: string }> = async (ctx: GetStaticPropsContext) => {
  const adapterCids = await getModulesForList(ctx.params!.listId as string)
  const sdk = new CryptoStatsSDK({})

  const allSubadapters: SubAdapter[] = []

  const adapters = await Promise.all(adapterCids.map(async (cid: string): Promise<AdapterData> => {
    const list = sdk.getList(cid)
    const module = await list.fetchAdapterFromIPFS(cid)

    const subadapters = await Promise.all(list.getAdapters().map(async(adapter: Adapter) => {
      const metadata = await adapter.getMetadata()
      const subadapter: SubAdapter = {
        id: adapter.id,
        name: metadata.name || adapter.id,
        icon: metadata.icon || null,
      }

      allSubadapters.push(subadapter)
      return subadapter
    }))

    return {
      cid,
      name: module.name || cid,
      subadapters,
    }
  }))

  return {
    props: {
      listId: ctx.params!.listId as string,
      adapters,
      subadapters: allSubadapters,
    },
    revalidate: 60,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const listNames = await getListNames()

  return {
    paths: listNames.map((listId: string) => ({ params: { listId } })),
    fallback: 'blocking',
  }
}
