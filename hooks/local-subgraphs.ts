import { useEffect, useRef, useState } from 'react'
import { DeployStatus, deploySubgraph } from 'utils/deploy-subgraph'
export { STATUS } from 'utils/deploy-subgraph'

const storageKey = 'localSubgraphs'

export const DEFAULT_MAPPING = 'mapping.ts'

interface Publication {
  cid: string
  version: string
}

export type Event = { signature: string; handler: string }

export interface Contract {
  name: string
  addresses: { [chain: string]: string }
  startBlocks: { [chain: string]: number }
  abi: any
  source: 'etherscan' | 'custom'
  events: Event[]
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

interface NewSubgraphParams {
  mapping?: string
  schema?: string
  publications?: Publication[]
  contracts?: Contract[]
}

export const newSubgraph = ({
  mapping = '',
  schema = '',
  publications = [],
  contracts = [],
}: NewSubgraphParams = {}) => {
  const id = randomId()

  const subgraph: SubgraphData = {
    mappings: { [DEFAULT_MAPPING]: mapping },
    schema,
    name: 'New Subgraph',
    contracts,
    publications,
    version: null,
  }

  setStorageItem(id, subgraph)
  return id
}

export const useLocalSubgraph = (id?: string | null) => {
  const _update = useState({})[1]
  const subgraphRef = useRef<null | SubgraphData>(null)
  const [deployStatus, setDeployStatus] = useState<null | DeployStatus>(null)

  const update = (newSubgraph: SubgraphData) => {
    setStorageItem(id!, newSubgraph)
    subgraphRef.current = newSubgraph
    _update({})
  }

  const saveSchema = (schema: string) => {
    if (!id) {
      throw new Error('ID not set')
    }

    const adapter = getStorageItem(id)

    const newAdapter: SubgraphData = { ...adapter, schema }

    update(newAdapter)

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

    update(newSubgraph)

    return id
  }

  const saveContracts = (contracts: Contract[]) => {
    if (!id) {
      throw new Error('ID not set')
    }

    const adapter = getStorageItem(id)

    const newSubgraph: SubgraphData = {
      ...adapter,
      contracts,
    }

    update(newSubgraph)

    return id
  }

  const deploy = async (subgraphName: string, deployKey: string) => {
    if (!id) {
      throw new Error(`No subgraph loaded`)
    }

    const subgraph = getStorageItem(id) as SubgraphData
    try {
      for await (const status of deploySubgraph(subgraph, { subgraphName, deployKey })) {
        setDeployStatus(status)
      }
    } catch (e: any) {
      console.error(e)
    }
  }

  useEffect(() => {
    subgraphRef.current = id ? (getStorageItem(id) as SubgraphData) : null
  }, [id])

  return {
    subgraph: subgraphRef.current,
    deployStatus,
    deploy,
    saveContracts,
    saveSchema,
    saveMapping,
  }
}
