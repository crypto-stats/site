import { Module } from '@cryptostats/sdk'
import { getSDK } from './sdk'

async function query(query: string) {
  const req = await fetch(
    'https://api.thegraph.com/subgraphs/name/dmihal/cryptostats-adapter-registry-test',
    {
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ query }),
      method: 'POST',
    }
  )
  const json = await req.json()
  if (json.errors) {
    console.error(query)
    throw new Error(`Error in adapter subgraph query: ${json.errors[0].message}`)
  }
  return json.data
}

export async function getCollectionNames(): Promise<string[]> {
  const response = await query(`{
    collections(where: { archived: false }) {
      id
    }
  }`)
  return response.collections.map((collection: any) => collection.id)
}

export async function getModulesForCollection(collection: string): Promise<any[]> {
  const response = await query(`{
    collectionAdapters(where: { collection: "${collection}"}) {
      adapter {
        id
      }
    }
  }`)
  return response.collectionAdapters.map((item: any) => item.adapter.id)
}

export async function getCollectionsForAdapter(adapterCID: string): Promise<string[]> {
  const response = await query(`  {
    adapter(id: "${adapterCID}") {
      collections {
        collection {
          id
        }
      }
    }
  }
`)
  return response.adapter?.collections.map((collection: any) => collection.collection.id) || []
}

export async function getProxyForCollection(collection: string): Promise<string | null> {
  const response = await query(`{
    collection(id: "${collection}") {
      proxy
    }
  }`)
  return response.collection?.proxy || null
}

export async function getCIDFromSlug(collectionId: string, slug: string) {
  const response = await query(`{
    collectionAdapters(where: {
      collection: "${collectionId}",
      adapterSlug: "${slug}"
    }) {
      adapter {
        id
      }
    }
  }`)

  return response.collectionAdapters.length > 0 ? response.collectionAdapters[0].adapter.id : null
}

export async function getAllVerifiedAdapters(): Promise<
  { collection: string; cid: string; slug: string | null }[]
> {
  const response = await query(`{
    collectionAdapters {
      adapter {
        id
        slug
      }
      collection {
        id
      }
    }
  }`)

  return response.collectionAdapters.map((collectionAdapter: any) => ({
    collection: collectionAdapter.collection.id,
    cid: collectionAdapter.adapter.id,
    slug: collectionAdapter.adapter.slug,
  }))
}

export interface Version {
  cid: string
  version: string | null
  verified: boolean
  signer: string | null
  activeCollections: string[]
}

export async function getPreviousVersions(cid: string, numberOfIterations = 4): Promise<Version[]> {
  const sdk = getSDK()

  let _cid: string | null = cid

  let result: Version[] = []

  for (let i = 0; _cid && i < numberOfIterations; i += 1) {
    const response = await query(`{
      adapter(id: "${_cid}") {
        version
        rootAdapter {
          descendents(orderBy: firstVerificationBlock, orderDirection: desc) {
            id
            version
            signer {
              id
            }
            collections {
              collection {
                id
              }
            }
          }
        }
      }
    }`)

    if (response.adapter) {
      return [
        ...result,
        ...response.adapter.rootAdapter.descendents.map((version: any) => ({
          version: version.version,
          cid: version.id,
          verified: true,
          signer: version.signer.id,
          activeCollections: version.collections.map((collection: any) => collection.collection.id),
        })),
      ]
    }

    try {
      const collection = sdk.getCollection(`test-${i}`)
      const adapter: Module = await collection.fetchAdapterFromIPFS(_cid)

      result.push({
        cid: _cid,
        version: adapter.version,
        verified: false,
        signer: adapter.signer,
        activeCollections: [],
      })

      _cid = adapter.previousVersion
    } catch (e) {
      console.warn(e)
      return result
    }
  }

  return []
}
