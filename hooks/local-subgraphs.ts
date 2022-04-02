import { useEffect, useState } from 'react'

const storageKey = 'localSubgraphs'

export const DEFAULT_MAPPING = 'mapping.ts'

interface Publication {
  cid: string
  version: string
}

export interface Contract {
  name: string
  addresses: { [chain: string]: string }
  startBlocks: { [chain: string]: number }
  abi: string
  customAbi: boolean
  events: { signature: string; handler: string }[]
}

export interface SubgraphData {
  name: string | null
  // For now, we only use one mapping (DEFAULT_MAPPING), but it's coded this way to be forward-compatable
  mappings: { [name: string]: string }
  schema: string
  version: string | null
  contracts: Contract[]
  publications: Publication[]
}

export interface SubgraphWithID extends SubgraphData {
  id: string
}

const getStorage = () =>
  typeof window === 'undefined' ? {} : JSON.parse(window.localStorage.getItem(storageKey) || '{}')

const getStorageItem = (id: string) => getStorage()[id] || null

const setStorageItem = (id: string, value: any) => {
  window.localStorage.setItem(
    storageKey,
    JSON.stringify({
      ...getStorage(),
      [id]: value,
    })
  )
  updateAdapterLists()
}

const adapterListUpdaters: Function[] = []

const updateAdapterLists = () => adapterListUpdaters.map(updater => updater())

export const useSubgraphList = (): SubgraphWithID[] => {
  const _update = useState({})[1]
  const update = () => _update({})

  useEffect(() => {
    adapterListUpdaters.push(update)

    return () => void adapterListUpdaters.splice(adapterListUpdaters.indexOf(update), 1)
  }, [])

  const list = Object.entries(getStorage()).map(([id, adapter]: [string, any]) => ({
    ...adapter,
    id,
  }))

  return list
}

const randomId = () => Math.floor(Math.random() * 1000000).toString(16)

export const newSubgraph = (mapping = '', schema = '', publications: Publication[] = []) => {
  const id = randomId()

  const subgraph: SubgraphData = {
    mappings: { [DEFAULT_MAPPING]: mapping },
    schema,
    name: 'New Subgraph',
    contracts: [],
    publications,
    version: null,
  }

  setStorageItem(id, subgraph)
  return id
}

export const useLocalSubgraph = (id?: string | null) => {
  const update = useState({})[1]

  const saveSchema = (schema: string) => {
    if (!id) {
      throw new Error('ID not set')
    }

    const adapter = getStorageItem(id)

    const newAdapter: SubgraphData = { ...adapter, schema }
    setStorageItem(id, newAdapter)
    update({})

    return id
  }

  const saveMapping = (fileName: string, mapping: string) => {
    if (!id) {
      throw new Error('ID not set')
    }

    const adapter = getStorageItem(id)

    const newSubgraph: SubgraphData = {
      ...adapter,
      mappings: { ...adapter.mappings, [fileName]: mapping },
    }

    setStorageItem(id, newSubgraph)
    update({})

    return id
  }

  const deploy = async (subgraphName: string, deployKey: string) => {
    const req = await fetch('/api/graph/deploy', {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'subgraph_deploy',
        params: {
          name: subgraphName,
          ipfs_hash: 'QmRfdqUX3boZxUHeDV17i1iBjL9AWq93FxXP12TfUKpvDj',
        },
        id: 2,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + deployKey,
      },
    })

    const json = await req.json()
    return json
  }

  const subgraph = id ? (getStorageItem(id) as SubgraphData) : null

  return {
    subgraph,
    deploy,
    saveSchema,
    saveMapping,
  }
}
