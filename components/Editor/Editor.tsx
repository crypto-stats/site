import React, { useState, useEffect, useRef } from 'react'
import { ViewPort, Top, LeftResizable, Left, Fill, RightResizable, Bottom, BottomResizable, Right } from 'react-spaces'
import { useRouter } from 'next/router'
import { LOG_LEVEL } from '@cryptostats/sdk'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { useENSName } from 'use-ens-name'
import Button from 'components/Button'
import CodeEditor from 'components/CodeEditor'
import ConnectionButton from 'components/ConnectionButton'
import FileList from 'components/FileList'
import ImageSelector from 'components/ImageSelector'
import { useAdapter, newModule } from 'hooks/local-adapters'
import { useCompiler } from 'hooks/compiler'
import { useConsole } from 'hooks/console'
import { emptyAdapter } from 'resources/templates'
import PrimaryFooter from './PrimaryFooter'
import RightPanel from './RightPanel'
import Tabs from './Tabs'
import EmptyState from './EmptyState'
import EditorModal from './EditorModal'
import NewAdapterForm from './NewAdapterForm'
import CloseIcon from 'components/CloseIcon'
import { MarkerSeverity } from './types'
import ErrorPanel from './ErrorPanel'
import { usePlausible } from 'next-plausible'
import { useEditorState } from '../../hooks/editor-state'
import EditorControls from './EditorControls'

const Header = styled(Top)`
  background-image: url("/editor_logo.png");
  background-size: 140px;
  background-color: #2F2F2F;
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
  background-color: #2F2F2F;

  & > .spaces-space > div {
    display: flex;
  }
`

const FilterBox = styled(Top)`
  display: flex;
  background: #212121;
  padding: 8px 16px;
`

const FilterField = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #c6c6c6;
`

const ClearButton = styled.button`
  width: 40px;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 8px 10px;

  & svg {
    fill: #333333;
  }
  &:hover svg {
    fill: #444444;
  }
`

const LeftFooter = styled(Bottom)`
  border-top: solid 1px #444447;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px;
`

const LeftCollapsed = styled(Left)`
  border-right: solid 2px #4a4a4d;
`

const CollapseButton = styled.button<{ open?: boolean }>`
  width: 24px;
  height: 24px;
  border: solid 1px #878787;
  border-radius: 4px;
  color: #878787;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;

  &:before {
    content: '${({ open }) => open ? '<' : '>'}';
  }

  &:hover {
    background: #333;
  }
`

const PrimaryFooterContainer = styled(Bottom)`
  border-top: solid 1px #444447;
  display: flex;
  background: #2f2f2f;
`

const LeftSidebarFooter = styled(Bottom)`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  align-items: center;
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
  const [fileName, setFileName] = useEditorState<string | null>('open-file', null)
  const [started, setStarted] = useState(false)
  const [leftCollapsed, setLeftCollapsed] = useEditorState('left-collapsed', false)
  const [newAdapterModalOpen, setNewAdapterModalOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const [markers, setMarkers] = useState<any[]>([])
  const [imageLibraryOpen, setImageLibraryOpen] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  const editorRef = useRef<any>(null)
  const { save, adapter } = useAdapter(fileName)
  const { evaluate, module } = useCompiler()
  const { addLine } = useConsole()
  const { account } = useWeb3React()
  const name = useENSName(account)

  useEffect(() => {
    const saveBlocker = (e: any) => {
      if ((e.metaKey || e.ctrlKey) && e.keyCode == 83) {
        e.preventDefault()
      }
    }

    window.document.addEventListener('keydown', saveBlocker, false)

    return () => window.document.removeEventListener('keydown', saveBlocker)
  }, [])

  useEffect(() => {
    if (module && adapter && (module.name !== adapter.name || module.version !== adapter.version)) {
      const name = module.name && module.name.length > 0 ? module.name : 'Unnamed Adapter'
      save(adapter.code, name, module.version || null)
    }
  }, [module])

  useEffect(() => {
    if (router.query.adapter) {
      const { adapter, ...query } = router.query
      setFileName(adapter as string)
      router.replace({ pathname: '/editor', query })
    }
  }, [router.query])

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
        <CloseButton onClick={() => router.push('/discover')}>X Close</CloseButton>

        <HeaderRight>
          <NewAdapterButton onClick={() => setNewAdapterModalOpen(true)}>New Adapter</NewAdapterButton>
          <WalletButton>{account ? name || account.substr(0, 10) : 'Connect Wallet'}</WalletButton>
        </HeaderRight>
      </Header>
      <PrimaryFill side="right">
        {leftCollapsed ? (
          <LeftCollapsed size={50}>
            <LeftFooter order={1} size={55}>
              <CollapseButton onClick={() => setLeftCollapsed(false)} />
            </LeftFooter>
          </LeftCollapsed>
        ) : (
          <LeftResizable size={298}>
            <FilterBox size={42} >
              <FilterField
                placeholder="Search for your Adapters here..."
                value={filter}
                onChange={(e: any) => setFilter(e.target.value)}
              />
              <ClearButton onClick={() => setFilter('')}>
                <CloseIcon />
              </ClearButton>
            </FilterBox>

            <Fill scrollable={true}>
              <FileList selected={fileName} onSelected={setFileName} filter={filter} />
            </Fill>

            <LeftSidebarFooter size={70}>
              <Button variant="outline" onClick={() => setImageLibraryOpen(true)}>Image Library</Button>
            </LeftSidebarFooter>

            <LeftFooter order={1} size={55}>
              <CollapseButton open onClick={() => setLeftCollapsed(true)} />
            </LeftFooter>
          </LeftResizable>
        )}

        <Fill>
          <FillWithStyledResize side="left">
            <Fill>
              <TabContainer size={50}>
                <Fill>
                  <Tabs current={adapter?.name} onClose={() => setFileName(null)} />
                </Fill>
                <Right size={100}>
                  <EditorControls editorRef={editorRef} />
                </Right>
              </TabContainer>

              <Fill>
                {(fileName && adapter) ? (
                  <CodeEditor
                    fileId={fileName}
                    defaultValue={adapter.code}
                    onMount={(editor: any) => {
                      editorRef.current = editor
                    }}
                    onChange={(code: string) => save(code, adapter.name, adapter.version)}
                    onValidated={(code: string, markers: any[]) => {
                      setMarkers(markers)

                      if (markers.filter((marker: any) => marker.severity === MarkerSeverity.Error).length === 0) {
                        evaluate({
                          code,
                          isTS: true,
                          onLog: (level: LOG_LEVEL, ...args: any[]) => addLine({
                            level: level.toString(),
                            value: args.map(formatLog).join(' '),
                          })
                        })
                      }
                    }}
                  />
                ) : (
                  <EmptyState onCreate={() => setNewAdapterModalOpen(true)} />
                )}
              </Fill>

              {showErrors && (
                <BottomResizable size={160} minimumSize={60} maximumSize={300}>
                  <ErrorPanel markers={markers} onClose={() => setShowErrors(false)} />
                </BottomResizable>
              )}
            </Fill>

            <RightResizable size={443}>
              <RightPanel />
            </RightResizable>
          </FillWithStyledResize>

          <PrimaryFooterContainer size={55}>
            <PrimaryFooter
              fileName={fileName}
              markers={markers}
              onMarkerClick={() => setShowErrors(true)}
              editorRef={editorRef}
            />
          </PrimaryFooterContainer>
        </Fill>
      </PrimaryFill>

      <EditorModal
        isOpen={imageLibraryOpen}
        onClose={() => setImageLibraryOpen(false)}
        title="Image Library"
        buttons={[
          { label: 'Return to Editor', onClick: () => setImageLibraryOpen(false) },
        ]}
        width="100%"
        height="70%"
      >
        <ImageSelector
          close={() => setImageLibraryOpen(false)}
          editor={editorRef.current}
        />
      </EditorModal>

      <EditorModal
        isOpen={newAdapterModalOpen}
        onClose={() => setNewAdapterModalOpen(false)}
        title="Create new adapter"
        buttons={[
          { label: 'Return to Editor', onClick: () => setNewAdapterModalOpen(false) },
          {
            label: 'Create Blank Adapter',
            onClick: () => {
              plausible('new-adapter', {
                props: {
                  template: 'blank',
                },
              })

              setFileName(newModule(emptyAdapter))
              setNewAdapterModalOpen(false)
            },
          },
        ]}
      >
        <NewAdapterForm
          onAdapterSelection={(fileName: string) => {
            setFileName(fileName)
            setNewAdapterModalOpen(false)
          }}
        />
      </EditorModal>
    </ViewPort>
  )
}

export default Editor
