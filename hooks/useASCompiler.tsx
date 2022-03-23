import React, { useContext, useState } from 'react'
import { compileAs } from 'utils/as-compiler'

interface CompilerState {
  code: string | null
  compiledCode: string | null
  error: string | null
  processing: boolean
}

const DEFAULT_STATE = {
  code: null,
  compiledCode: null,
  error: null,
  processing: false,
}

const CompilerContext = React.createContext<{
  state: CompilerState
  setState(state: CompilerState): void
}>({
  state: DEFAULT_STATE,

  setState() {
    throw new Error('Not initialized')
  },
})

interface EvaluateParams {
  code: string
}

export const useASCompiler = () => {
  const { state, setState } = useContext(CompilerContext)

  const evaluate = async ({ code }: EvaluateParams) => {
    setState({ ...DEFAULT_STATE, code, processing: true })

    try {
      const result = await compileAs(code)
      console.log(result)

      setState({ ...DEFAULT_STATE, code, compiledCode: result })
    } catch (e) {
      console.warn(e)
      setState({ ...DEFAULT_STATE, error: e.message })
    }
  }

  return { ...state, evaluate }
}

export const ASCompilerProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<CompilerState>(DEFAULT_STATE)

  return <CompilerContext.Provider value={{ state, setState }}>{children}</CompilerContext.Provider>
}
