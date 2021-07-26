import React, { useState, useRef } from 'react'
import Editor from 'components/Editor'
import { CryptoStatsSDK, List, Module } from '@cryptostats/sdk'
import ModulePreview from 'components/ModulePreview'
import { compileTsToJs } from 'utils/ts-compiler'

const EditorPage = () => {
  const list = useRef<List | null>(null)
  const [module, setModule] = useState<Module | null>(null)
  const [error, setError] = useState<string | null>(null)

  const evaluate = async (code: string, isTS?: boolean) => {
    const sdk = new CryptoStatsSDK()
    const _list = sdk.getList('test')
    try {
      let _code = code
      if (isTS) {
        _code = await compileTsToJs(code)
      }
      const _module = _list.addAdaptersWithCode(_code)
      setModule(_module)
      list.current = _list;
      setError(null)
      console.log(_module, _list)
    } catch (e) {
      setError(e.message)
      setModule(null)
    }
  }

  return (
    <div>
      <Editor onValidated={(code: string) => evaluate(code, true)} />
      {error && <div>Error: {error}</div>}
      {module && list.current && <ModulePreview list={list.current} module={module} />}
    </div>
  )
}

export default EditorPage
