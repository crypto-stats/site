import { useEffect, useState } from 'react'
import { deploySubgraph } from 'utils/deploy-subgraph'

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
  abi: any
  source: 'etherscan' | 'custom'
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
    contracts: [
      {
        name: 'UniV2Factory',
        addresses: {
          '1': '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        },
        startBlocks: { '1': 10000835 },
        abi: JSON.stringify([
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'address', name: 'token0', type: 'address' },
              { indexed: true, internalType: 'address', name: 'token1', type: 'address' },
              { indexed: false, internalType: 'address', name: 'pair', type: 'address' },
              { indexed: false, internalType: 'uint256', name: '', type: 'uint256' },
            ],
            name: 'PairCreated',
            type: 'event',
          },
        ]),
        source: 'etherscan',
        events: [
          {
            signature: 'PairCreated(indexed address,indexed address,address,uint256)',
            handler: 'handlePairCreated',
          },
        ],
      },
    ],
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
    if (!subgraph) {
      throw new Error(`No subgraph loaded`)
    }

    try {
      for await (const status of deploySubgraph(subgraph, { subgraphName, deployKey })) {
        console.log(status)
      }
    } catch (e: any) {
      console.error(e)
    }
  }

  const subgraph = id ? (getStorageItem(id) as SubgraphData) : null

  return {
    subgraph,
    deploy,
    saveSchema,
    saveMapping,
  }
}
