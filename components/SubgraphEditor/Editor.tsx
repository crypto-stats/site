import React, { useState, useEffect, useRef } from 'react'
import { ViewPort, Top, Fill, Bottom, BottomResizable, Right } from 'react-spaces'
import { useRouter } from 'next/router'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { useENSName } from 'use-ens-name'
import CodeEditor from 'components/CodeEditor'
import ConnectionButton from 'components/ConnectionButton'
import { useLocalSubgraph, newSubgraph, DEFAULT_MAPPING } from 'hooks/local-subgraphs'
import PrimaryFooter from './PrimaryFooter'
import { Tabs, TabState } from './Tabs'
import EditorModal from './EditorModal'
import NewAdapterForm from './NewAdapterForm'
import { MarkerSeverity } from './types'
import ErrorPanel from './ErrorPanel'
import { usePlausible } from 'next-plausible'
import EditorControls from './EditorControls'
import Console from './Console'
import BottomTitleBar, { BottomView } from './BottomTitleBar'
import SaveMessage from './SaveMessage'
import ImageLibrary from './ImageLibrary/ImageLibrary'
import { useEditorState } from 'hooks/editor-state'

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

const SCHEMA_FILE_NAME = 'schema.graphql'

const Editor: React.FC = () => {
  const router = useRouter()
  const plausible = usePlausible()
  const [subgraphId, setSubgraphId] = useEditorState<string | null>('subgraph-file')
  const [tab, setTab] = useState(SCHEMA_FILE_NAME)

  const { saveSchema, saveMapping, subgraph } = useLocalSubgraph(subgraphId)

  const subgraphFiles: (TabState & { value: string })[] = subgraph
    ? [
        {
          type: 'schema',
          name: 'Schema',
          fileId: SCHEMA_FILE_NAME,
          open: true,
          focused: tab === SCHEMA_FILE_NAME,
          value: subgraph.schema,
        },
        {
          type: 'mapping',
          name: 'Mapping',
          fileId: DEFAULT_MAPPING,
          open: true,
          focused: tab !== SCHEMA_FILE_NAME,
          value: subgraph.mappings[DEFAULT_MAPPING],
        },
      ]
    : []

  const focusedTab = subgraphFiles.find(sgf => sgf.focused)!

  const [started, setStarted] = useState(false)
  const [newAdapterModalOpen, setNewAdapterModalOpen] = useState(false)
  const [markers, setMarkers] = useState<any[]>([])
  const [imageLibraryOpen, setImageLibraryOpen] = useState(false)
  const [bottomView, setBottomView] = useState(BottomView.NONE)
  const editorRef = useRef<any>(null)

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
                    openTabs={subgraphFiles}
                    current={tab}
                    onSelect={fileId => setTab(fileId || SCHEMA_FILE_NAME)}
                  />
                </Fill>
                <Right size={100}>
                  <EditorControls editorRef={editorRef} />
                </Right>
              </TabContainer>

              <Fill>
                {subgraph ? (
                  <CodeEditor
                    defaultLanguage={focusedTab.type === 'schema' ? 'graphql' : 'typescript'}
                    fileId={tab}
                    defaultValue={focusedTab.value}
                    onMount={(editor: any) => {
                      editorRef.current = editor
                    }}
                    onChange={(code: string) =>
                      tab === SCHEMA_FILE_NAME ? saveSchema(code) : saveMapping(tab, code)
                    }
                    onValidated={(_code: string, markers: any[]) => {
                      setMarkers(markers)

                      if (
                        markers.filter((marker: any) => marker.severity === MarkerSeverity.Error)
                          .length === 0
                      ) {
                        // Evaluate code
                      }
                    }}
                  />
                ) : (
                  <div style={{ color: 'white' }}>Empty state</div>
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
            {subgraph ? (
              <PrimaryFooter
                fileName={subgraphId}
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
            label: 'Create Blank Subgraph',
            onClick: () => {
              plausible('new-subgraph', {
                props: {
                  template: 'blank',
                },
              })

              setSubgraphId(newSubgraph())
              setNewAdapterModalOpen(false)
            },
          },
        ]}
      >
        <NewAdapterForm
          onAdapterSelection={(_fileName: string) => {
            // setMappingFileName(fileName)
            setNewAdapterModalOpen(false)
          }}
        />
      </EditorModal>
    </ViewPort>
  )
}

export default Editor
