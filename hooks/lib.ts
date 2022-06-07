import { useEffect, useRef, useState } from 'react'

export const runOnce = (fn: () => void) => {
  const ran = useRef(false)

  if (!ran.current) {
    fn()
    ran.current = true
  }
}

export class UpdateListener {
  private listeners: Function[] = []

  register() {
    const _update = useState({})[1]
    const update = () => _update({})

    useEffect(() => {
      this.listeners.push(update)

      return () => void this.listeners.splice(this.listeners.indexOf(update), 1)
    }, [])
  }

  trigger() {
    this.listeners.map(updater => updater())
  }
}

function objEquals<T>(a: T, b: T) {
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false
  }

  for (let k in a) {
    if (a[k] !== b[k]) {
      return false
    }
  }
  return true
}

export const withStorageItem = <T>(storageKey: string) => {
  type ItemTransformer = (oldItem: T) => T

  const listUpdater = new UpdateListener()

  let localCache: { [id: string]: T } | null = null

  const getStorage = (): { [id: string]: T } =>
    typeof window === 'undefined' ? {} : JSON.parse(window.localStorage.getItem(storageKey) || '{}')

  const setStorageItem = (id: string, value: T) => {
    if (!localCache) {
      localCache = getStorage()
    }

    localCache = { ...localCache, [id]: value }

    window.localStorage.setItem(
      storageKey,
      JSON.stringify(localCache)
    )
    listUpdater.trigger()
  }

  const clearStorageItem = (id: string) => {
    if (!localCache) {
      localCache = getStorage()
    }
    delete localCache[id]
    window.localStorage.setItem(storageKey, JSON.stringify(localCache))
  }

  const useStorageItem = (
    id?: string | null
  ): [T | null, (newVal: T | ItemTransformer) => void, () => void] => {
    const item = useRef<T | null>(null)
    listUpdater.register()

    if (id) {
      if (!localCache) {
        localCache = getStorage()
      }
      item.current = localCache[id]
    } else {
      item.current = null
    }

    const updateItem = (newVal: T | ItemTransformer) => {
      if (!id) {
        throw new Error('ID not set')
      }
      if (!localCache) {
        localCache = getStorage()
      }

      const _newVal: T =
        typeof newVal === 'function' ? (newVal as ItemTransformer)(localCache[id]) : newVal

      setStorageItem(id, _newVal)
    }

    const removeItem = () => {
      if (!id) {
        throw new Error('ID not set')
      }
      if (!localCache) {
        localCache = getStorage()
      }
      delete localCache[id]
      clearStorageItem(id)
    }

    return [item.current, updateItem, removeItem]
  }

  const useStorageList = (): Array<T & { id: string }> => {
    listUpdater.register()

    if (!localCache) {
      localCache = getStorage()
    }

    const storageList = Object.entries(localCache).map(([id, adapter]: [string, any]) => ({
      ...adapter,
      id,
    }))
    const lastCache = useRef({ ...localCache })
    const list = useRef(storageList)

    if (!objEquals(lastCache.current, localCache)) {
      lastCache.current = { ...localCache }
      list.current = storageList
    }

    return list.current
  }

  return { useStorageItem, useStorageList, setStorageItem, clearStorageItem }
}
