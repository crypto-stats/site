import React, { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Modal from 'react-modal'
import { NextPage } from 'next'
import Link from 'next/link';
import styled from 'styled-components'
import { CryptoStatsSDK, List, Module } from '@cryptostats/sdk'
import Editor from 'components/Editor'
import Layout from 'components/Layout'
import ModulePreview from 'components/ModulePreview'
import ImageSelector from 'components/ImageSelector'
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

const Toolbar = styled.div`
  display: flex;
`

const Spacer = styled.div`
  flex: 1;
`

Modal.setAppElement('#__next');

const EditorPage: NextPage = () => {
  const router = useRouter()
  const list = useRef<List | null>(null)
  const parsedCode = useRef<string | null>(null)
  const [module, setModule] = useState<Module | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const { save, publish, cid, code: initialCode } = useAdapter(router.query.id?.toString())

  const evaluate = async (code: string, isTS?: boolean) => {
    parsedCode.current = null
    const sdk = new CryptoStatsSDK({
      moralisKey: process.env.NEXT_PUBLIC_MORALIS_KEY,
    })
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
    const newId = save(parsedCode.current!, module!.name!)
    if (router.query.id === 'new') {
      router.replace(`/editor/${newId}`)
    }
  }

  const publishToIPFS = async () => {
    setPublishing(true)
    await publish(parsedCode.current!, module!.name!)
    setPublishing(false)
  }

  const canSave = module && parsedCode.current && parsedCode.current !== initialCode
  const canPublish = module && parsedCode.current

  return (
    <Layout>
      <Toolbar>
        <button disabled={!canSave} onClick={saveToBrowser}>
          Save in Browser
        </button>
        <button disabled={!canPublish || publishing} onClick={publishToIPFS}>
          Publish to IPFS
        </button>
        {cid && (
          <Link href={`/module/${cid}`}>
            <a>Last published to IPFS as {cid.substr(0,6)}...{cid.substr(-4)}</a>
          </Link>
        )}

        <Spacer />

        <button onClick={() => setShowModal(true)}>Images</button>
      </Toolbar>

      {initialCode && (
        <Editor onValidated={(code: string) => evaluate(code, true)} defaultValue={initialCode} />
      )}
      {error && <ErrorBar>Error: {error}</ErrorBar>}
      {module && list.current && (
        <ModuleContainer>
          <ModulePreview list={list.current} module={module} />
        </ModuleContainer>
      )}

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Insert Image"
      >
        <ImageSelector close={() => setShowModal(false)} />
      </Modal>
    </Layout>
  )
}

export default EditorPage
