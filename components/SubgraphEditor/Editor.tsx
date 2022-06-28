import React, { useState, useEffect, useRef } from 'react'
import { ViewPort, Top, Fill, Bottom, BottomResizable, Right } from 'react-spaces'
import styled from 'styled-components'
import CodeEditor from 'components/CodeEditor'
import { useLocalSubgraph, DEFAULT_MAPPING } from 'hooks/local-subgraphs'
import PrimaryFooter from './PrimaryFooter'
import { PrimaryHeader } from './PrimaryHeader'
import { Tabs, TabState } from './Tabs'
import { MarkerSeverity } from './types'
import ErrorPanel from './ErrorPanel'
import EditorControls from './EditorControls'
import Console from './Console'
import BottomTitleBar, { BottomView } from './BottomTitleBar'
import { EDITOR_TYPES, useEditorState } from 'hooks/editor-state'
import { useGeneratedFiles } from 'hooks/useGeneratedFiles'
import { LeftSide } from './LeftSide'
import { SubgraphConfig } from './SubgraphConfig'
import { EmptyState } from './EmptyState'

const StyledViewPort = styled(ViewPort)`
  background-color: var(--color-dark-200);
  font-family: Manrope;

  @media (max-width: 780px) {
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

const TabContainer = styled(Top)`
  background-color: #0f1012;

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

const SCHEMA_FILE_NAME = 'schema.graphql'

const Editor: React.FC = () => {
  const [subgraphId, setSubgraphId] = useEditorState<string | null>(EDITOR_TYPES['subgraph-file'])
  const [tab, setTab] = useEditorState(EDITOR_TYPES['subgraph-tab'], 'config')
  const [showDocs, setShowDocs] = useState(false)

  const { saveSchema, saveMapping, subgraph } = useLocalSubgraph(subgraphId)
  const [jumpToLine, setJumpToLine] = useState<string | null>(null)
  const mappingFileSplitted = subgraph?.mappings['mapping.ts']?.split('\n') || []
  const lineOfSelectedFn =
    jumpToLine !== null
      ? mappingFileSplitted?.indexOf(
          mappingFileSplitted.find(mfl => mfl.includes(jumpToLine)) || 'n/a'
        )
      : -1

  const subgraphFiles: (TabState & { value: string })[] = subgraph
    ? [
        {
          type: 'schema',
          name: 'schema',
          fileId: SCHEMA_FILE_NAME,
          open: true,
          focused: tab === SCHEMA_FILE_NAME,
          value: subgraph.schema,
        },
        {
          type: 'mapping',
          name: 'mapping',
          fileId: DEFAULT_MAPPING,
          open: true,
          focused: tab === DEFAULT_MAPPING,
          value: subgraph.mappings[DEFAULT_MAPPING],
        },
      ]
    : []

  const focusedTab = subgraphFiles.find(sgf => sgf.focused)!

  const [started, setStarted] = useState(false)
  const [markers, setMarkers] = useState<any[]>([])
  const [bottomView, setBottomView] = useState(BottomView.NONE)
  const editorRef = useRef<any>(null)

  useEffect(() => {
    if (tab !== 'config') {
      editorRef.current?.focus()
    }
  }, [tab])

  // Generating files is computationally expensive, don't waste resources if the schema tab is open
  const extraLibs = useGeneratedFiles(focusedTab?.type === 'schema' ? null : subgraph)

  useEffect(() => {
    if (!subgraph) {
      editorRef.current = null
    }
  }, [subgraph])

  useEffect(() => {
    setStarted(true)
  }, [])
  if (!started) {
    return null
  }

  return (
    <StyledViewPort>
      <LeftSide
        subgraphId={subgraphId}
        setSubgraphId={setSubgraphId}
        showDocs={showDocs}
        setShowDocs={setShowDocs}
      />
      <FillWithStyledResize side="right">
        <PrimaryHeader filename={subgraphId} markers={markers} editorRef={editorRef} />
        <Fill>
          {subgraph ? (
            <>
              <FillWithStyledResize side="left">
                <Fill>
                  <TabContainer size={40}>
                    <Fill>
                      <Tabs
                        openTabs={[
                          {
                            name: 'config',
                            type: 'config',
                            fileId: 'config',
                            open: true,
                            focused: tab === 'config',
                          },
                          ...subgraphFiles,
                        ]}
                        current={tab}
                        onSelect={fileId => setTab(fileId || SCHEMA_FILE_NAME)}
                      />
                    </Fill>
                    <Right size={100}>
                      <EditorControls editorRef={editorRef} />
                    </Right>
                  </TabContainer>

                  <Fill scrollable={tab === 'config'}>
                    {(() => {
                      if (tab !== 'config') {
                        return (
                          <CodeEditor
                            defaultLanguage={
                              focusedTab.type === 'schema' ? 'graphql' : 'typescript'
                            }
                            fileId={tab}
                            defaultValue={focusedTab.value}
                            extraLibs={extraLibs}
                            onMount={(editor: any) => {
                              editorRef.current = editor
                              editorRef.current?.focus()
                              if (focusedTab.type === 'mapping' && lineOfSelectedFn !== -1) {
                                editorRef.current?.setPosition({
                                  lineNumber: lineOfSelectedFn + 1,
                                  column: 1,
                                })
                              }
                            }}
                            onChange={(code: string) =>
                              tab === SCHEMA_FILE_NAME ? saveSchema(code) : saveMapping(tab, code)
                            }
                            onValidated={(_code: string, markers: any[]) => {
                              setMarkers(markers)

                              if (
                                markers.filter(
                                  (marker: any) => marker.severity === MarkerSeverity.Error
                                ).length === 0
                              ) {
                                // Evaluate code
                              }
                            }}
                          />
                        )
                      } else {
                        return <SubgraphConfig setJumpToLine={setJumpToLine} />
                      }
                    })()}
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
              </FillWithStyledResize>
              {tab !== 'config' ? (
                <PrimaryFooterContainer size={55}>
                  <PrimaryFooter
                    markers={markers}
                    onMarkerClick={() => setBottomView(BottomView.ERRORS)}
                    onConsoleClick={() => setBottomView(BottomView.CONSOLE)}
                  />
                </PrimaryFooterContainer>
              ) : null}
            </>
          ) : (
            <EmptyState />
          )}
        </Fill>
      </FillWithStyledResize>
    </StyledViewPort>
  )
}

export default Editor
