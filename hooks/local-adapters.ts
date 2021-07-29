import { useEffect, useState } from 'react'
// @ts-ignore
import sampleModule from '!raw-loader!../components/sample-module.txt'

const storageKey = 'localAdapters'

export const useAdapterList = () => {
  const [list, setList] = useState<any[]>([])
  useEffect(() => {
    const existingStorage = JSON.parse(window.localStorage.getItem(storageKey) || '{}')
    const newList = Object.entries(existingStorage).map(([id, adapter]: [string, any]) => ({ ...adapter, id }))
    setList(newList)
  }, []);
  return list
}

const randomId = () => Math.floor(Math.random() * 1000000).toString(16)

export const useAdapter = (id: string) => {
  const [defaultCode, setDefaultCode] = useState<string | null>(null)
  
  const save = (code: string, name: string) => {
    const _id = id === 'new' ? randomId() : id
    const existingStorage = JSON.parse(window.localStorage.getItem(storageKey) || '{}')
    window.localStorage.setItem(storageKey, JSON.stringify({
      ...existingStorage,
      [_id]: { code, name },
    }))
    setDefaultCode(code)

    return _id;
  }

  useEffect(() => {
    if (id === 'new') {
      return setDefaultCode(sampleModule)
    }

    const existingStorage = JSON.parse(window.localStorage.getItem(storageKey) || '{}')
    setDefaultCode(existingStorage[id]?.code || null)
  }, [id])

  return { save, code: defaultCode }
}
