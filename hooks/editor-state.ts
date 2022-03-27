import { useEffect, useState, Dispatch, SetStateAction } from 'react'

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

export function useEditorState<T = any>(
  key: string,
  defaultState?: T,
  storageKey: string = 'editor-state'
): [T, Dispatch<SetStateAction<T>>] {
  const storedState = getEditorState({ key, storageKey })
  const [value, setValue] = useState<T>(
    storedState === undefined ? defaultState || null : storedState
  )

  useEffect(() => {
    setEditorState({ key, value, storageKey })
  }, [value])

  return [value, setValue]
}
