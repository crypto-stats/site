import { useEffect, useState } from 'react'
// @ts-ignore
import sampleModule from '!raw-loader!../components/sample-module.txt'

const storageKey = 'localAdapters'

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

export const newModule = (code: string = sampleModule, cid?: string | null) => {
  const id = randomId()
  setStorageItem(id, { code, name: 'New Module', cid: cid || null })
  return id
}

export const useAdapter = (id?: string | null) => {
  const update = useState({})[1]
  
  const save = (code: string, name: string, cid?: string) => {
    const _id = id || randomId()
    const _adapter = { code, name, cid: cid || null }
    setStorageItem(_id, _adapter)
    update({})

    return _id!;
  }

  const publish = async (code: string, name: string) => {
    const req = await fetch('/api/upload-adapter', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        code,
        language: 'typescript',
      })
    })

    const response = await req.json()

    save(code, name, response.codeCID)
    return response
  }

  const adapter = id ? getStorageItem(id) : null

  return { save, publish, adapter }
}
