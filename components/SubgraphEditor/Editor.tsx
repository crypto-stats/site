import React, { useState, useEffect, useRef } from 'react'
import { ViewPort, Top, Fill, Bottom, BottomResizable, Right } from 'react-spaces'
import { useRouter } from 'next/router'
import { LOG_LEVEL } from '@cryptostats/sdk'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { useENSName } from 'use-ens-name'
import CodeEditor from 'components/CodeEditor'
import ConnectionButton from 'components/ConnectionButton'
import { useSubgraph, newModule, getStorageItem, FileData } from 'hooks/local-subgraphs'
import { useCompiler } from 'hooks/compiler'
import { useConsole } from 'hooks/console'
import { emptyMapping, emptySchema } from 'resources/templates'
import PrimaryFooter from './PrimaryFooter'
import { Tabs, TabState } from './Tabs'
import EditorModal from './EditorModal'
import NewAdapterForm from './NewAdapterForm'
import { MarkerSeverity } from './types'
import ErrorPanel from './ErrorPanel'
import { usePlausible } from 'next-plausible'
import { useEditorState } from '../../hooks/editor-state'
import EditorControls from './EditorControls'
import Console from './Console'
import BottomTitleBar, { BottomView } from './BottomTitleBar'
import SaveMessage from './SaveMessage'
import ImageLibrary from './ImageLibrary/ImageLibrary'

const Header = styled(Top)`
  background-image: url('/editor_logo.png');
  background-size: 140px;
  background-color: #2f2f2f;
  background-position: center;
  background-repeat: no-repeat;
  border-bottom: solid 1px #4a4a4d;
  display: flex;
  justify-content: space-between;
`

const HeaderRight = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 700px) {
    display: none;
  }
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  font-weight: 600;
  color: white;
  margin-left: 16px;

  &:hover {
    cursor: pointer;
  }
`

const NewAdapterButton = styled.button`
  height: 35px;
  border: solid 1px;
  background: transparent;
  border: solid 1px #0477f4;
  color: #0477f4;
  margin: 0 10px;
  padding: 0 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #0477f430;
  }
`

const WalletButton = styled(ConnectionButton)`
  height: 35px;
  border-radius: 5px;
  border: solid 1px #7b7b7b;
  background-color: #535353;
  padding: 0 10px;
  color: #eeeeee;
  margin-right: 10px;
  cursor: pointer;

  &:hover {
    background-color: #404040;
  }
`

const TabContainer = styled(Top)`
  background-color: #2f2f2f;

  & > .spaces-space > div {
    display: flex;
  }
`

const PrimaryFooterContainer = styled(Bottom)`
  border-top: solid 1px #444447;
  display: flex;
  background: #2f2f2f;
`

const FillWithStyledResize = styled(Fill)<{ side: string }>`
  > .spaces-resize-handle {
    ${({ side }) => 'border-' + side}: solid 2px #4a4a4d;
    box-sizing: border-box;
  }
`

const PrimaryFill = styled(FillWithStyledResize)`
  @media (max-width: 700px) {
    & > * {
      display: none;
    }

    &:before {
      content: 'The CryptoStats editor is not available on mobile devices 😢';
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin: 32px;
      font-size: 24px;
      text-align: center;
    }
  }
`

const formatLog = (val: any) => {
  if (val.toString() === '[object Object]') {
    return JSON.stringify(val, null, 2)
  } else if (typeof val === 'string') {
    return `"${val}"`
  }
  return val.toString()
}

const Editor: React.FC = () => {
  const router = useRouter()
  const plausible = usePlausible()
  const [subgraphFiles, setSubgraphFiles] = useEditorState<TabState[] | []>(
    'test',
    [
      { type: 'schema', fileId: null, open: true, focused: true },
      { type: 'mapping', fileId: null, open: true, focused: false },
    ],
    'subgraph-editor-state'
  )
  const { save } = useSubgraph()

  const openTabs = (subgraphFiles || [])
    .filter(sgf => sgf.open)
    .map(ot => ({ ...ot, ...(ot.fileId && { fileData: getStorageItem(ot.fileId) as FileData }) }))
  const focusedTab = openTabs?.find(sgf => sgf.focused)!

  useEffect(() => {
    setSubgraphFiles((prev: TabState[]) =>
      prev.map(pi =>
        pi.open && !pi.fileId
          ? {
              ...pi,
              fileId: newModule(
                pi?.type === 'schema'
                  ? { code: emptySchema, name: 'New Schema' }
                  : { code: emptyMapping, name: 'New Mapping' }
              ),
            }
          : pi
      )
    )
  }, [])

  const [started, setStarted] = useState(false)
  const [newAdapterModalOpen, setNewAdapterModalOpen] = useState(false)
  const [markers, setMarkers] = useState<any[]>([])
  const [imageLibraryOpen, setImageLibraryOpen] = useState(false)
  const [bottomView, setBottomView] = useState(BottomView.NONE)
  const editorRef = useRef<any>(null)

  const { evaluate, module } = useCompiler()
  const { addLine } = useConsole()
  const { account } = useWeb3React()
  const name = useENSName(account)

  // useEffect(() => {
  //   if (router.query.adapter) {
  //     const { adapter, ...query } = router.query
  //     setFileName(adapter as string)
  //     router.replace({ pathname: '/editor', query })
  //   }
  // }, [router.query])

  useEffect(() => {
    if (imageLibraryOpen) {
      plausible('open-image-library')
    }
  }, [imageLibraryOpen])

  useEffect(() => {
    setStarted(true)
  }, [])
  if (!started) {
    return null
  }

  const saveCode = (code: string) =>
    save(focusedTab.fileId!, code, focusedTab.fileData!.name, focusedTab.fileData!.version)

  return (
    <ViewPort style={{ background: '#0f1011' }}>
      <Header size={64} order={1}>
        <SaveMessage />

        <CloseButton onClick={() => router.push('/discover')}>X Close</CloseButton>

        <HeaderRight>
          <NewAdapterButton onClick={() => setNewAdapterModalOpen(true)}>
            New Adapter
          </NewAdapterButton>
          <WalletButton>{account ? name || account.substr(0, 10) : 'Connect Wallet'}</WalletButton>
        </HeaderRight>
      </Header>
      <PrimaryFill side="right">
        <Fill>
          <FillWithStyledResize side="left">
            <Fill>
              <TabContainer size={50}>
                <Fill>
                  <Tabs
                    openTabs={openTabs}
                    current={focusedTab.fileData?.name}
                    onSelect={fileId =>
                      setSubgraphFiles(prev =>
                        prev.map(p => ({ ...p, focused: p.fileId === fileId }))
                      )
                    }
                  />
                </Fill>
                <Right size={100}>
                  <EditorControls editorRef={editorRef} />
                </Right>
              </TabContainer>

              <Fill>
                {focusedTab?.fileData ? (
                  <CodeEditor
                    defaultLanguage={focusedTab.type === 'schema' ? 'graphql' : 'typescript'}
                    fileId={focusedTab.fileId!}
                    defaultValue={focusedTab?.fileData?.code}
                    onMount={(editor: any) => {
                      editorRef.current = editor
                    }}
                    onChange={saveCode}
                    onValidated={(code: string, markers: any[]) => {
                      setMarkers(markers)

                      if (
                        markers.filter((marker: any) => marker.severity === MarkerSeverity.Error)
                          .length === 0
                      ) {
                        evaluate({
                          code,
                          isTS: true,
                          onLog: (level: LOG_LEVEL, ...args: any[]) =>
                            addLine({
                              level: level.toString(),
                              value: args.map(formatLog).join(' '),
                            }),
                        })
                      }
                    }}
                  />
                ) : (
                  <div>test</div>
                )}
              </Fill>

              {bottomView !== BottomView.NONE && (
                <BottomResizable size={160} minimumSize={60} maximumSize={300}>
                  <Top size={42}>
                    <BottomTitleBar view={bottomView} onSetView={setBottomView} />
                  </Top>
                  <Fill>
                    {bottomView === BottomView.ERRORS ? (
                      <ErrorPanel
                        markers={markers}
                        onClose={() => setBottomView(BottomView.NONE)}
                      />
                    ) : (
                      <Console />
                    )}
                  </Fill>
                </BottomResizable>
              )}
            </Fill>

            {/* <RightResizable size={443}>
              <RightPanel />
            </RightResizable> */}
          </FillWithStyledResize>

          <PrimaryFooterContainer size={55}>
            {focusedTab?.fileData ? (
              <PrimaryFooter
                fileName={focusedTab?.fileData.name}
                markers={markers}
                onMarkerClick={() => setBottomView(BottomView.ERRORS)}
                onConsoleClick={() => setBottomView(BottomView.CONSOLE)}
                editorRef={editorRef}
              />
            ) : null}
          </PrimaryFooterContainer>
        </Fill>
      </PrimaryFill>

      <ImageLibrary
        open={imageLibraryOpen}
        close={() => setImageLibraryOpen(false)}
        editor={editorRef.current}
      />

      <EditorModal
        isOpen={newAdapterModalOpen}
        onClose={() => setNewAdapterModalOpen(false)}
        title="Create new adapter"
        buttons={[
          {
            label: 'Return to Editor',
            onClick: () => setNewAdapterModalOpen(false),
          },
          {
            label: 'Create Blank Adapter',
            onClick: () => {
              plausible('new-adapter', {
                props: {
                  template: 'blank',
                },
              })

              // setMappingFileName(newModule(emptyMapping))
              setNewAdapterModalOpen(false)
            },
          },
        ]}>
        <NewAdapterForm
          onAdapterSelection={(fileName: string) => {
            // setMappingFileName(fileName)
            setNewAdapterModalOpen(false)
          }}
        />
      </EditorModal>
    </ViewPort>
  )
}

export default Editor
