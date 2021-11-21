import { useEffect, useState } from 'react'
// @ts-ignore
import sampleModule from '!raw-loader!../components/sample-module.txt'

const storageKey = 'localAdapters'

interface Publication {
  cid: string
  version: string
}

interface Adapter {
  code: string
  name: string | null
  version: string | null
  publications: Publication[]
}

const getStorage = () => typeof window === 'undefined'
  ? {}
  : JSON.parse(window.localStorage.getItem(storageKey) || '{}')

const getStorageItem = (id: string) => getStorage()[id] || null

const setStorageItem = (id: string, value: any) => {
  window.localStorage.setItem(storageKey, JSON.stringify({
    ...getStorage(),
    [id]: value,
  }))
  updateAdapterLists()
}

const adapterListUpdaters: Function[] = []

const updateAdapterLists = () => adapterListUpdaters.map(updater => updater())

export const useAdapterList = () => {
  const _update = useState({})[1]
  const update = () => _update({})

  useEffect(() => {
    adapterListUpdaters.push(update)

    return () => void adapterListUpdaters.splice(adapterListUpdaters.indexOf(update), 1)
  }, [])

  const list = Object.entries(getStorage())
    .map(([id, adapter]: [string, any]) => ({ ...adapter, id }))

  return list
}

const randomId = () => Math.floor(Math.random() * 1000000).toString(16)

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

export const useAdapter = (id?: string | null) => {
  const update = useState({})[1]
  
  const save = (code: string, name: string | null, version: string | null) => {
    if (!id) {
      throw new Error('ID not set')
    }

    const adapter = getStorageItem(id)

    const newAdapter: Adapter = { ...adapter, code, name, version }
    setStorageItem(id, newAdapter)
    update({})

    return id;
  }

  const publish = async ({ signature }: { signature?: string } = {}) => {
    if (!id) {
      throw new Error('ID not set')
    }

    const adapter = getStorageItem(id)
    const previousVersion = adapter?.publications && adapter.publications.length > 0
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
      })
    })

    const response = await req.json()

    const newAdapter: Adapter = {
      ...adapter,
      code: adapter.code,
      name: adapter.name,
      publications: [
        ...(adapter.publications || []),
        { cid: response.codeCID, version: adapter.version, signature },
      ],
    }
    setStorageItem(id, newAdapter)
    update({})

    return response
  }

  const prepare = async () => {
    if (!id) {
      throw new Error('ID not set')
    }

    const adapter = getStorageItem(id)
    const previousVersion = adapter?.publications && adapter.publications.length > 0
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
      })
    })

    const response = await req.json()
    return response.code
  }

  const adapter = id ? getStorageItem(id) as Adapter : null

  return { save, publish, adapter, prepare }
}
