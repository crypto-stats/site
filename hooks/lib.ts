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
  for (let k in a) {
    if (a[k] !== b[k]) {
      return false
    }
  }
  return true
}

export const withStorageItem = <T>(storageKey: string) => {
  const listUpdater = new UpdateListener()

  let localCache: { [id: string]: T } | null = null

  const getStorage = (): { [id: string]: T } =>
    typeof window === 'undefined' ? {} : JSON.parse(window.localStorage.getItem(storageKey) || '{}')

  // const getStorageItem = (id: string) => getStorage()[id] || null

  const setStorageItem = (id: string, value: T) => {
    if (!localCache) {
      localCache = getStorage()
    }

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        ...localCache,
        [id]: value,
      })
    )
  }

  const clearStorageItem = (id: string) => {
    if (!localCache) {
      localCache = getStorage()
    }
    delete localCache[id]
    window.localStorage.setItem(storageKey, JSON.stringify(localCache))
  }

  const useStorageItem = (id?: string | null): [T | null, (newVal: T) => void, () => void] => {
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

    const updateItem = (newVal: T) => {
      if (!id) {
        throw new Error('ID not set')
      }
      if (!localCache) {
        localCache = getStorage()
      }
      localCache[id] = newVal
      setStorageItem(id, newVal)
      listUpdater.trigger()
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
