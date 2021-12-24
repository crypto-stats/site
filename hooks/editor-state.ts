import { useState } from 'react'

let state: { [key: string]: any } | null = null

const storageKey = 'editor-state'

export function getEditorState(key: string) {
  if (!state) {
    const isServer = typeof window === 'undefined'
    if (isServer) {
      return null
    }

    state = JSON.parse(window.localStorage.getItem(storageKey) || '{}')
  }

  return state![key] || null
}

export function setEditorState(key: string, val: any) {
  if (state![key] === val) {
    return
  }

  state![key] = val

  window.localStorage.setItem(storageKey, JSON.stringify(state))
}

export function useEditorState<T = any>(key: string, defaultState?: T): [T, (val: T) => void] {
  const [value, setValue] = useState<T>(getEditorState(key) || defaultState || null)

  const setAndSave = (val: T) => {
    setValue(val)
    setEditorState(key, val)
  }

  return [value, setAndSave]
}
