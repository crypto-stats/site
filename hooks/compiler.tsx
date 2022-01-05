import React, { useContext, useState } from 'react'
import { List, Module, LOG_LEVEL } from '@cryptostats/sdk'
import { compileTsToJs } from 'utils/ts-compiler'
import { getSDK } from 'utils/sdk'

interface CompilerState {
  code: string | null
  compiledCode: string | null
  list: List | null
  module: Module | null
  error: string | null
  processing: boolean 
}

const DEFAULT_STATE = {
  code: null,
  compiledCode: null,
  list: null,
  module: null,
  error: null,
  processing: false,
}

const CompilerContext = React.createContext<{
  state: CompilerState,
  setState(state: CompilerState): void
}>({
  state: DEFAULT_STATE,

  setState() { throw new Error('Not initialized') },
})

interface EvaluateParams {
  code: string
  isTS?: boolean
  onLog?: (level: LOG_LEVEL, ...args: any[]) => void
}

export const useCompiler = () => {
  const { state, setState } = useContext(CompilerContext)

  const evaluate = async ({ code, isTS, onLog }: EvaluateParams) => {
    setState({ ...DEFAULT_STATE, code, processing: true })

    const sdk = getSDK({ onLog })

    const list = sdk.getList('test')

    try {
      let compiledCode = null
      if (isTS) {
        compiledCode = await compileTsToJs(code)
      }
      const module = list.addAdaptersWithCode(compiledCode || code)

      setState({ ...DEFAULT_STATE, code, module, compiledCode, list })
    } catch (e) {
      console.warn(e)
      setState({ ...DEFAULT_STATE, error: e.message })
    }
  }

  return { ...state, evaluate }
}

export const CompilerProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<CompilerState>(DEFAULT_STATE)

  return (
    <CompilerContext.Provider value={{ state, setState }}>{children}</CompilerContext.Provider>
  )
}
