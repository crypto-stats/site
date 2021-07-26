import React, { useState, useRef } from 'react'
import { NextPage } from 'next'
import styled from 'styled-components'
import { CryptoStatsSDK, List, Module } from '@cryptostats/sdk'
import Editor from 'components/Editor'
import Layout from 'components/Layout'
import ModulePreview from 'components/ModulePreview'
import { compileTsToJs } from 'utils/ts-compiler'

const ErrorBar = styled.div`
  background: red;
  color: white;
  padding: 8px;
`

const ModuleContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 200px;
  overflow: auto;
`

const EditorPage: NextPage = () => {
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
    <Layout>
      <Editor onValidated={(code: string) => evaluate(code, true)} />
      {error && <ErrorBar>Error: {error}</ErrorBar>}
      {module && list.current && (
        <ModuleContainer>
          <ModulePreview list={list.current} module={module} />
        </ModuleContainer>
      )}
    </Layout>
  )
}

export default EditorPage
