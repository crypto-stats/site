import { useState } from 'react'
import { DeployStatus, deploySubgraph, STATUS } from 'utils/deploy-subgraph'
import { withStorageItem } from './lib'
export { STATUS } from 'utils/deploy-subgraph'

const storageKey = 'localSubgraphs'

export const DEFAULT_MAPPING = 'mapping.ts'

interface Publication {
  cid: string
  version: string
}

export type ContractEvent = { signature: string; handler: string }

export interface Contract {
  name: string
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
  version: string | null
  contracts: Contract[]
  publications: Publication[]
}

export interface SubgraphWithID extends SubgraphData {
  id: string
}

const { useStorageItem, useStorageList, setStorageItem, clearStorageItem } =
  withStorageItem<SubgraphData>(storageKey)

export const useSubgraphList = useStorageList

export const deleteSubgraph = clearStorageItem

const randomId = () => Math.floor(Math.random() * 1000000).toString(16)

interface NewSubgraphParams {
  mapping?: string
  schema?: string
  publications?: Publication[]
  contracts?: Contract[]
}

export const newSubgraph = ({
  mapping = '',
  schema = 'type Character {name: String!}',
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
    version: null,
  }

  setStorageItem(id, subgraph)
  return id
}

export const useLocalSubgraph = (id?: string | null) => {
  const [subgraph, update] = useStorageItem(id)
  const [deployStatus, setDeployStatus] = useState<null | DeployStatus>(null)

  const saveSchema = (schema: string) => {
    if (!id || !subgraph) {
      throw new Error('ID not set')
    }

    update({ ...subgraph, schema })

    return id
  }

  const saveMapping = (fileName: string, mapping: string) => {
    if (!id || !subgraph) {
      throw new Error('ID not set')
    }

    update({
      ...subgraph,
      mappings: { ...subgraph.mappings, [fileName]: mapping },
    })

    return id
  }

  const saveContracts = (contracts: Contract[]) => {
    if (!id || !subgraph) {
      throw new Error('ID not set')
    }

    update({ ...subgraph, contracts })

    return id
  }

  const deploy = async (subgraphName: string, deployKey: string) => {
    if (!id || !subgraph) {
      throw new Error(`No subgraph loaded`)
    }

    try {
      for await (const status of deploySubgraph(subgraph, { subgraphName, deployKey })) {
        setDeployStatus(status)
      }
    } catch (e: any) {
      console.error(e)
      setDeployStatus({ status: STATUS.ERROR, errorMessage: e.message })
    }
  }

  return {
    update,
    subgraph,
    deployStatus,
    deploy,
    saveContracts,
    saveSchema,
    saveMapping,
  }
}
