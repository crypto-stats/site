import { UpdateListener } from './lib'

let state: { [key: string]: any } | null = null

export function getEditorState({ key, storageKey }: { key: string; storageKey: string }) {
  if (!state) {
    const isServer = typeof window === 'undefined'
    if (isServer) {
      return null
    }

    state = JSON.parse(window.localStorage.getItem(storageKey) || '{}')
  }

  return key in state! ? state![key] : undefined
}

export function setEditorState({
  key,
  value,
  storageKey,
}: {
  key: string
  value: any
  storageKey: string
}) {
  if (state![key] === value) {
    return
  }

  state![key] = value

  window.localStorage.setItem(storageKey, JSON.stringify(state))
}

const updaters: { [key: string]: UpdateListener } = {}

const getUpdater = (key: string) => {
  if (!updaters[key]) {
    updaters[key] = new UpdateListener()
  }
  return updaters[key]
}

export const EDITOR_TYPES = {
  'editor-state': 'editor-state',
  'subgraph-file': 'subgraph-file',
  'subgraph-tab': 'subgraph-tab',
}

export function useEditorState<T = any>(
  key: string,
  defaultState?: T,
  storageKey: keyof typeof EDITOR_TYPES = 'editor-state'
): [T, (val: T) => void] {
  const updater = getUpdater(key)
  updater.register()

  const value = getEditorState({ key, storageKey }) || defaultState || null

  const setValue = (newVal: T) => {
    setEditorState({ key, value: newVal, storageKey })
    updater.trigger()
  }

  return [value, setValue]
}
