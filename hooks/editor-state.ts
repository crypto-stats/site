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
  EDITOR_STATE: 'EDITOR_STATE',
  SUBGRAPH_FILE: 'SUBGRAPH_FILE',
  SUBGRAPH_TAB: 'SUBGRAPH_TAB',
}

export function useEditorState<T = any>(key: string, defaultState?: T, storageKey?: string): [T, (val: T) => void]
export function useEditorState<T = any>(key?: string | null, defaultState?: T, storageKey?: string): [T | null, (val: T) => void]
export function useEditorState<T = any>(
  key?: string | null,
  defaultState?: T,
  storageKey: string = EDITOR_TYPES.EDITOR_STATE
): [T | null, (val: T) => void] {
  const updater = getUpdater(key || 'undefined')
  updater.register()

  if (!key) {
    return [null, () => null]
  }

  let value: T | null = getEditorState({ key, storageKey })

  if (value === null || value === undefined) {
    value = defaultState || null
  }

  const setValue = (newVal: T) => {
    setEditorState({ key, value: newVal, storageKey })
    updater.trigger()
  }

  return [value, setValue]
}
