import React, { useState, useRef, Fragment, useEffect } from 'react'
import { useRouter } from 'next/router'
import Modal from 'react-modal'
import { NextPage } from 'next'
import Link from 'next/link';
import styled from 'styled-components'
import { CryptoStatsSDK, List, Module } from '@cryptostats/sdk'
import Button from 'components/Button'
import Editor from 'components/Editor'
import ModulePreview from 'components/ModulePreview'
import ImageSelector from 'components/ImageSelector'
import { useAdapter } from 'hooks/local-adapters'
import { compileTsToJs } from 'utils/ts-compiler'
import { ViewPort, Top, LeftResizable, Fill, RightResizable, CenterType, Bottom } from 'react-spaces';

const ErrorBar = styled.div`
  background: red;
  color: white;
  padding: 8px;
`

const ModuleContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

const Toolbar = styled.div`
  display: flex;
`

const Spacer = styled.div`
  flex: 1;
`

const CodeContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  border: solid 1px gray;
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
  const [loaded, setLoaded] = useState(false)
  const { save, publish, cid, code: initialCode } = useAdapter(router.query.id?.toString())
  const saveableCode = useRef(initialCode)

  // Hacky way to re-render
  const [_rerenderCnt, _rerender] = useState(1)
  const rerender = () => _rerender(_rerenderCnt + 1)

  useEffect(() => {
    setLoaded(true)
  }, [])

  const evaluate = async (code: string, isTS?: boolean) => {
    parsedCode.current = null
    saveableCode.current = code
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
    const newId = save(saveableCode.current!, module!.name!)
    if (router.query.id === 'new') {
      router.replace(`/editor/${newId}`)
    }
  }

  const publishToIPFS = async () => {
    setPublishing(true)
    await publish(parsedCode.current!, module!.name!)
    setPublishing(false)
  }

  const canSave = module?.name && saveableCode.current && saveableCode.current !== initialCode
  const canPublish = module && parsedCode.current

  if (!loaded) {
    return <div>Loading</div>
  }

  return (
    <Fragment>
      <ViewPort>
        <Top size={25} order={1} centerContent={CenterType.Vertical}>
          <Toolbar>
            <Button disabled={!canSave} onClick={saveToBrowser}>
              Save in Browser
            </Button>
            <Button disabled={!canPublish || publishing} onClick={publishToIPFS}>
              Publish to IPFS
            </Button>
            {cid && (
              <Link href={`/module/${cid}`}>
                <a>Last published to IPFS as {cid.substr(0,6)}...{cid.substr(-4)}</a>
              </Link>
            )}

            <Spacer />

            <Button onClick={() => setShowModal(true)}>Images</Button>
          </Toolbar>
        </Top>

        <Fill>
          <LeftResizable size={200}>
            Side
          </LeftResizable>
          <Fill>
            <Fill>
              <CodeContainer>
                {initialCode && (
                  <Editor
                    onValidated={(code: string) => evaluate(code, true)}
                    onChange={(code: string) => {
                      saveableCode.current = code
                      rerender()
                    }}
                    defaultValue={initialCode}
                  />
                )}
              </CodeContainer>
            </Fill>

            <Bottom size={50}>
              {error && <ErrorBar>Error: {error}</ErrorBar>}
            </Bottom>
          </Fill>

          <RightResizable size={200}>
            {module && list.current && (
              <ModuleContainer>
                <ModulePreview list={list.current} module={module} />
              </ModuleContainer>
            )}
          </RightResizable>
        </Fill>
      </ViewPort>

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Insert Image"
      >
        <ImageSelector close={() => setShowModal(false)} />
      </Modal>
    </Fragment>
  )
}

export default EditorPage
