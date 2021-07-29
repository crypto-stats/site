import React, { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import styled from 'styled-components'
import { CryptoStatsSDK, List, Module } from '@cryptostats/sdk'
import Editor from 'components/Editor'
import Layout from 'components/Layout'
import ModulePreview from 'components/ModulePreview'
import { useAdapter } from 'hooks/local-adapters'
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
  const router = useRouter()
  const list = useRef<List | null>(null)
  const parsedCode = useRef<string | null>(null)
  const [module, setModule] = useState<Module | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { save, publish, code: initialCode } = useAdapter(router.query.id)

  const evaluate = async (code: string, isTS?: boolean) => {
    parsedCode.current = null
    const sdk = new CryptoStatsSDK()
    const _list = sdk.getList('test')
    try {
      let _code = code
      if (isTS) {
        _code = await compileTsToJs(code)
      }
      const _module = _list.addAdaptersWithCode(_code)
      list.current = _list
      parsedCode.current = code
      setModule(_module)
      setError(null)
      console.log(_module, _list)
    } catch (e) {
      setError(e.message)
      setModule(null)
    }
  }

  const saveToBrowser = () => {
    const newId = save(parsedCode.current!, module.name)
    if (router.query.id === 'new') {
      router.replace(`/editor/${newId}`)
    }
  }

  const publishToIPFS = async () => {
    await publish(parsedCode.current!)
  }

  const canSave = module && parsedCode.current && parsedCode.current !== initialCode;

  return (
    <Layout>
      <div>
        <button disabled={!canSave} onClick={saveToBrowser}>
          Save in Browser
        </button>
        <button disabled={!canSave} onClick={publishToIPFS}>
          Publish to IPFS
        </button>
      </div>

      {initialCode && (
        <Editor onValidated={(code: string) => evaluate(code, true)} defaultValue={initialCode} />
      )}
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
