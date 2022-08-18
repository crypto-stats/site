import { withStorageItem } from './lib'
import { PublishConfig } from './useSubgraphDeployment'

const storageKey = 'localSubgraphs'

export const DEFAULT_MAPPING = 'mapping.ts'

interface Publication {
  cid: string
  version: string
  node: string
}

export interface ContractEvent {
  signature: string
  handler: string
  receipt?: boolean
}

export interface Contract {
  name: string
  isTemplate: boolean
  addresses: { [chain: string]: string }
  startBlocks: { [chain: string]: number }
  abi: any
  source: 'etherscan' | 'custom'
  events: ContractEvent[]
}

export interface SubgraphData {
  name: string | null
  // For now, we only use one mapping (DEFAULT_MAPPING), but it's coded this way to be forward-compatable
  mappings: { [name: string]: string }
  schema: string
  version: string
  contracts: Contract[]
  publications: Publication[]
  publishConfig: PublishConfig | null
}

export interface SubgraphWithID extends SubgraphData {
  id: string
}

const { useStorageItem, useStorageList, setStorageItem, clearStorageItem } =
  withStorageItem<SubgraphData>(storageKey)

export const useSubgraphList = useStorageList

export const deleteSubgraph = clearStorageItem

const randomId = () => Math.floor(Math.random() * 1000000).toString(16)

export const DEFAULT_PUBLISH_CONFIG: PublishConfig = {
  name: '',
  accessToken: '',
  network: 'ethereum',
  node: 'studio',
}

interface NewSubgraphParams {
  mapping?: string
  schema?: string
  publications?: Publication[]
  contracts?: Contract[]
}

export const newSubgraph = ({
  mapping = '',
  schema = `type Entity @entity {
  id: ID!
  name: String!
}`,
  publications = [],
  contracts = [],
}: NewSubgraphParams = {}) => {
  const id = randomId()

  const subgraph: SubgraphData = {
    mappings: { [DEFAULT_MAPPING]: mapping },
    schema,
    name: 'Untitled subgraph',
    contracts,
    publications,
    version: '0.0.1',
    publishConfig: DEFAULT_PUBLISH_CONFIG,
  }

  setStorageItem(id, subgraph)
  return id
}

export const useLocalSubgraph = (id?: string | null) => {
  const [subgraph, update] = useStorageItem(id)

  const saveSchema = (schema: string) => {
    if (!id || !subgraph) {
      throw new Error('ID not set')
    }

    update(_subgraph => ({ ..._subgraph, schema }))

    return id
  }

  const saveMapping = (fileName: string, mapping: string) => {
    if (!id || !subgraph) {
      throw new Error('ID not set')
    }

    update(_subgraph => ({
      ..._subgraph,
      mappings: { ..._subgraph.mappings, [fileName]: mapping },
    }))

    return id
  }

  const saveContracts = (contracts: Contract[]) => {
    update(_subgraph => ({ ..._subgraph, contracts }))

    return id
  }

  const setPublishConfig = (config?: PublishConfig | null) =>
    update(_subgraph => ({ ..._subgraph, publishConfig: config || null }))

  return {
    update,
    subgraph,
    saveContracts,
    saveSchema,
    saveMapping,
    setPublishConfig,
  }
}
