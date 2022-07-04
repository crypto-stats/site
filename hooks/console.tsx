import React, { useCallback, useContext, useState } from 'react'

export interface Line {
  level: string
  value: string
}

interface ConsoleState {
  lines: Line[]
}

const DEFAULT_STATE = {
  lines: [],
}

const CompilerContext = React.createContext<{
  state: ConsoleState
  setState(state: ConsoleState | ((state: ConsoleState) => ConsoleState)): void
}>({
  state: DEFAULT_STATE,

  setState() {
    throw new Error('Not initialized')
  },
})

export const useConsole = () => {
  const { state, setState } = useContext(CompilerContext)

  const addLine = useCallback(
    (line: Line) => {
      setState((oldState: ConsoleState) => ({ ...oldState, lines: [...oldState.lines, line] }))
    },
    [setState]
  )

  const clear = useCallback(
    () => setState((oldState: ConsoleState) => ({ ...oldState, lines: [] })),
    [setState]
  )

  return { ...state, addLine, clear }
}

export const ConsoleProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<ConsoleState>(DEFAULT_STATE)

  return <CompilerContext.Provider value={{ state, setState }}>{children}</CompilerContext.Provider>
}
