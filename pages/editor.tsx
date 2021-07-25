import React, { useState } from 'react'
// import Editor from 'components/Editor'
import { CryptoStatsSDK, List } from '@cryptostats/sdk'
import ListPreview from 'components/ListPreview'

const EditorPage = () => {
  const [list, setList] = useState<List | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [code, setCode] = useState(`module.exports.setup = function setup(context) {
    context.register({
        id: 'my-adapter',
        queries: {
          fees: async (date) => Math.random(),
        },
        metadata: {},
    })
}
`)
  const evaluate = () => {
    const sdk = new CryptoStatsSDK()
    const list = sdk.getList('test')
    try {
      list.addAdaptersWithCode(code)
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
      {/*<Editor />*/}
      <textarea value={code} onChange={(e: any) => setCode(e.target.value)} />
      <button onClick={evaluate}>Evaluate</button>
      {error && <div>Error: {error}</div>}
      {list && <ListPreview list={list} />}
    </div>
  )
}

export default EditorPage
