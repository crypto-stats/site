import { useEffect, useState } from 'react'
// @ts-ignore
import sampleModule from '!raw-loader!../components/sample-module.txt'

const storageKey = 'localAdapters'

const getStorage = () => JSON.parse(window.localStorage.getItem(storageKey) || '{}')

const getStorageItem = (id: string) => getStorage()[id] || null

const setStorageItem = (id: string, value: any) => window.localStorage.setItem(storageKey, JSON.stringify({
    ...getStorage(),
    [id]: value,
  }))

export const useAdapterList = () => {
  const [list, setList] = useState<any[]>([])
  useEffect(() => {
    const newList = Object.entries(getStorage())
      .map(([id, adapter]: [string, any]) => ({ ...adapter, id }))

    setList(newList)
  }, []);
  return list
}

const randomId = () => Math.floor(Math.random() * 1000000).toString(16)

export const newModule = (code: string, cid?: string | null) => {
  const id = randomId()
  setStorageItem(id, { code, name, cid: cid || null })
  return id
}

export const useAdapter = (id?: string) => {
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
