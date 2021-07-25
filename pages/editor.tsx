import React, { useState } from 'react'
import Editor from 'components/Editor'
import { CryptoStatsSDK, List } from '@cryptostats/sdk'
import ListPreview from 'components/ListPreview'
import { compileTsToJs } from 'utils/ts-compiler'

const EditorPage = () => {
  const [list, setList] = useState<List | null>(null)
  const [error, setError] = useState<string | null>(null)

  const evaluate = async (code: string, isTS?: boolean) => {
    const sdk = new CryptoStatsSDK()
    const list = sdk.getList('test')
    try {
      let _code = code
      if (isTS) {
        _code = await compileTsToJs(code)
      }
      list.addAdaptersWithCode(_code)
      setList(list)
      setError(null)
      console.log(list)
    } catch (e) {
      setError(e.message)
      setList(null)
    }
  }

  return (
    <div>
      <Editor onValidated={(code: string) => evaluate(code, true)} />
      {error && <div>Error: {error}</div>}
      {list && <ListPreview list={list} />}
    </div>
  )
}

export default EditorPage
