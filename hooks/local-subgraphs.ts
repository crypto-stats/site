import { useEffect, useState } from 'react'
// @ts-ignore
import sampleModule from '!raw-loader!../components/sample-module.txt'

const storageKey = 'localSubgraphs'

interface Publication {
  cid: string
  version: string
}

export interface FileData {
  code: string
  name: string | null
  version: string | null
  publications: Publication[]
}

export interface AdapterWithID extends Adapter {
  id: string
}

const getStorage = () =>
  typeof window === 'undefined' ? {} : JSON.parse(window.localStorage.getItem(storageKey) || '{}')

export const getStorageItem = (id: string) => getStorage()[id] || null

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

export const useAdapterList = (): AdapterWithID[] => {
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

interface NewModuleProps {
  code: string
  publications?: Publication[]
  name?: string
}

export const newModule = ({
  name = 'New Module',
  code = sampleModule,
  publications = [],
}: NewModuleProps) => {
  const id = randomId()

  const adapter: FileData = {
    code,
    name,
    publications,
    version: null,
  }

  setStorageItem(id, adapter)
  return id
}

export const useSubgraph = () => {
  const update = useState({})[1]

  const save = (id: string, code: string, name: string | null, version: string | null) => {
    if (!id) {
      throw new Error('ID not set')
    }

    const adapter = getStorageItem(id)

    const newAdapter: Adapter = { ...adapter, code, name, version }
    setStorageItem(id, newAdapter)
    update({})

    return id
  }

  const publish = async ({
    signature,
    hash,
    signer,
  }: { signature?: string; signer?: string | null; hash?: string | null } = {}) => {
    // if (!id) {
    //   throw new Error('ID not set')
    // }
    // const adapter = getStorageItem(id)
    // const previousVersion =
    //   adapter?.publications && adapter.publications.length > 0
    //     ? adapter.publications[adapter.publications.length - 1]
    //     : null
    // if (previousVersion && adapter.version === previousVersion.version) {
    //   throw new Error(`Version ${adapter.version} is already published`)
    // }
    // const req = await fetch('/api/upload-adapter', {
    //   method: 'POST',
    //   headers: {
    //     'Content-type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     code: adapter.code,
    //     version: adapter.version,
    //     previousVersion: previousVersion?.cid || null,
    //     language: 'typescript',
    //     signature,
    //     hash,
    //     signer,
    //   }),
    // })
    // const response = await req.json()
    // if (!response.success) {
    //   throw new Error(response.error)
    // }
    // const newAdapter: Adapter = {
    //   ...adapter,
    //   code: adapter.code,
    //   name: adapter.name,
    //   publications: [
    //     ...(adapter.publications || []),
    //     { cid: response.codeCID, version: adapter.version, signature },
    //   ],
    // }
    // setStorageItem(id, newAdapter)
    // update({})
    // return response
  }

  const getSignableHash = async () => {
    // if (!id) {
    //   throw new Error('ID not set')
    // }
    // const adapter = getStorageItem(id)
    // const previousVersion =
    //   adapter?.publications && adapter.publications.length > 0
    //     ? adapter.publications[adapter.publications.length - 1]
    //     : null
    // if (previousVersion && adapter.version === previousVersion.version) {
    //   throw new Error(`Version ${adapter.version} is already published`)
    // }
    // const req = await fetch('/api/prepare-adapter', {
    //   method: 'POST',
    //   headers: {
    //     'Content-type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     code: adapter.code,
    //     version: adapter.version,
    //     previousVersion: previousVersion?.cid || null,
    //     language: 'typescript',
    //   }),
    // })
    // const { hash } = await req.json()
    // const message = `CryptoStats Adapter Hash: ${hash}`
    // return message
  }

  const getDataFile = (id: string) => getStorageItem(id)

  return { save, publish, getSignableHash, getDataFile }
}
