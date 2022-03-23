import { useEffect, useState } from 'react'
import { useGeneratedSubgraphFiles } from './useGeneratedSubgraphFiles'

const storageKey = 'localSubgraphs'

const DEFAULT_MAPPING = 'mapping.ts'

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

  const saveMapping = (mapping: string) => {
    if (!id) {
      throw new Error('ID not set')
    }

    const adapter = getStorageItem(id)

    const newSubgraph: SubgraphData = {
      ...adapter,
      mappings: { ...adapter.mappings, [DEFAULT_MAPPING]: mapping },
    }

    setStorageItem(id, newSubgraph)
    update({})

    return id
  }

  const publish = async () => {
    if (!id) {
      throw new Error('ID not set')
    }

    //todo
  }

  const getSignableHash = async () => {
    if (!id) {
      throw new Error('ID not set')
    }

    const adapter = getStorageItem(id)
    const previousVersion =
      adapter?.publications && adapter.publications.length > 0
        ? adapter.publications[adapter.publications.length - 1]
        : null

    if (previousVersion && adapter.version === previousVersion.version) {
      throw new Error(`Version ${adapter.version} is already published`)
    }

    const req = await fetch('/api/prepare-adapter', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        code: adapter.code,
        version: adapter.version,
        previousVersion: previousVersion?.cid || null,
        language: 'typescript',
      }),
    })

    const { hash } = await req.json()
    const message = `CryptoStats Subgraph Hash: ${hash}`
    return message
  }

  const subgraph = id ? (getStorageItem(id) as SubgraphData) : null

  const generatedFiles = useGeneratedSubgraphFiles(subgraph?.schema, subgraph?.contracts)
  console.log(generatedFiles)

  return {
    subgraph,
    generatedFiles,
    saveSchema,
    saveMapping,
    publish,
    getSignableHash,
  }
}
