// @ts-ignore
import sampleModule from '!raw-loader!../components/sample-module.txt'
import semver from 'semver'
import { withStorageItem } from './lib'

const storageKey = 'localAdapters'

interface Publication {
  cid: string
  version: string
  signature?: string
}

export interface Adapter {
  code: string
  name: string | null
  version: string | null
  publications: Publication[]
}

export interface AdapterWithID extends Adapter {
  id: string
}

const randomId = () => Math.floor(Math.random() * 1000000).toString(16)

const sortPublications = (a: Publication, b: Publication) =>
  semver.lt(a.version, b.version) ? -1 : 1

const { useStorageItem, useStorageList, setStorageItem } = withStorageItem<Adapter>(storageKey)

export const newModule = (code: string = sampleModule, publications: Publication[] = []) => {
  const id = randomId()

  const adapter: Adapter = {
    code,
    name: 'New Module',
    publications,
    version: null,
  }

  setStorageItem(id, adapter)
  return id
}

export const useAdapterList = useStorageList

export const useAdapter = (id?: string | null) => {
  const [adapter, updateAdapter] = useStorageItem(id)

  const save = (code: string, name: string | null, version: string | null) => {
    if (!adapter) {
      throw new Error('ID not set')
    }

    const newAdapter: Adapter = { ...adapter, code, name, version }
    updateAdapter(newAdapter)

    return id
  }

  const publish = async ({
    signature,
    hash,
    signer,
  }: {
    signature: string
    signer: string
    hash: string
  }) => {
    if (!id || !adapter) {
      throw new Error('ID not set')
    }

    const previousVersion =
      adapter?.publications && adapter.publications.length > 0
        ? adapter.publications[adapter.publications.length - 1]
        : null

    if (previousVersion && adapter.version === previousVersion.version) {
      throw new Error(`Version ${adapter.version} is already published`)
    }

    const req = await fetch('/api/upload-adapter', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        code: adapter.code,
        version: adapter.version,
        previousVersion: previousVersion?.cid || null,
        language: 'typescript',
        signature,
        hash,
        signer,
      }),
    })

    const response = await req.json()

    if (!response.success) {
      throw new Error(response.error)
    }

    const newAdapter: Adapter = {
      ...adapter,
      code: adapter.code,
      name: adapter.name,
      publications: [
        ...(adapter.publications || []),
        { cid: response.codeCID, version: adapter.version || 'v0.0.0', signature },
      ],
    }
    updateAdapter(newAdapter)

    return response
  }

  const getSignableHash = async () => {
    if (!id || !adapter) {
      throw new Error('ID not set')
    }

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
    const message = `CryptoStats Adapter Hash: ${hash}`
    return message
  }

  const savePublications = (publications: Publication[]) => {
    updateAdapter(_adapter => ({
      ..._adapter,
      publications: [...publications, ..._adapter.publications].sort(sortPublications),
    }))
  }

  return {
    adapter,
    save,
    publish,
    getSignableHash,
    savePublications,
  }
}
