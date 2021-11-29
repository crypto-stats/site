import React, { useState, useEffect } from 'react'
import { ViewPort, Top, LeftResizable, Fill, RightResizable, Bottom } from 'react-spaces'
import { useRouter } from 'next/router'
import { LOG_LEVEL } from '@cryptostats/sdk'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import Button from 'components/Button'
import CodeEditor from 'components/CodeEditor'
import ConnectionButton from 'components/ConnectionButton'
import FileList from 'components/FileList'
import ImageSelector from 'components/ImageSelector'
import EditorModal from 'components/EditorModal'
import { useAdapter, newModule } from 'hooks/local-adapters'
import { useCompiler } from 'hooks/compiler'
import { useConsole } from 'hooks/console'
import { useENSName } from 'hooks/ens'
import PrimaryFooter from './PrimaryFooter'
import RightPanel from './RightPanel'
import Tabs from './Tabs'

const Left = styled(LeftResizable)`
  display: flex;
  flex-direction: column;
`

const Header = styled(Top)`
  background-image: url("/logo-white.svg");
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
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  font-weight: 600;
  color: white;
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
  display: flex;
`

const LeftFooter = styled(Bottom)`
  border-top: solid 1px #444447;
`

const PrimaryFooterContainer = styled(Bottom)`
  border-top: solid 1px #444447;
  display: flex;
  background: #2f2f2f;
`

const FillWithStyledResize = styled(Fill)`
  > .spaces-resize-handle {
    border-left: solid 2px #4a4a4d;
    box-sizing: border-box;
  }
`

const Editor: React.FC = () => {
  const router = useRouter()
  const [fileName, setFileName] = useState<string | null>(null)
  const [started, setStarted] = useState(false)
  const [imageLibraryOpen, setImageLibraryOpen] = useState(false)
  const { save, adapter } = useAdapter(fileName)
  const { evaluate, module } = useCompiler()
  const { addLine } = useConsole()
  const { account } = useWeb3React()
  const name = useENSName(account)

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
    setStarted(true)
  }, [])
  if (!started) {
    return null
  }

  return (
    <ViewPort style={{ background: '#0f1011' }}>
      <Header size={64} order={1}>
        <CloseButton onClick={() => router.push('/adapters')}>Close</CloseButton>

        <HeaderRight>
          <NewAdapterButton onClick={() => setFileName(newModule())}>New Adapter</NewAdapterButton>
          <WalletButton>{account ? name || account.substr(0, 10) : 'Connect Wallet'}</WalletButton>
        </HeaderRight>
      </Header>
      <Fill>
        <Left size={200}>
          <Fill scrollable={true}>
            <FileList selected={fileName} onSelected={setFileName} />
          </Fill>

          <Bottom size={30}>
            <Button onClick={() => setImageLibraryOpen(true)}>Image Library</Button>
          </Bottom>

          <LeftFooter order={1} size={55} style={{ borderTop: 'solid 1px #444447' }} />
        </Left>

        <Fill>
          <FillWithStyledResize>
            <Fill>
              <TabContainer size={50}>
                <Tabs current={adapter?.name} onClose={() => setFileName(null)} />
              </TabContainer>

              <Fill>
                {fileName && adapter && (
                  <CodeEditor
                    fileId={fileName}
                    defaultValue={adapter.code}
                    onChange={(code: string) => save(code, adapter.name, adapter.version)}
                    onValidated={(code: string) => evaluate({
                      code,
                      isTS: true,
                      onLog: (level: LOG_LEVEL, ...args: any[]) => addLine({
                        level: level.toString(),
                        value: args.join(' '),
                      })
                    })}
                  />
                )}
              </Fill>
            </Fill>

            <RightResizable size={200}>
              <RightPanel />
            </RightResizable>
          </FillWithStyledResize>

          <PrimaryFooterContainer size={55}>
            <PrimaryFooter fileName={fileName} />
          </PrimaryFooterContainer>
        </Fill>
      </Fill>


      <EditorModal
        isOpen={imageLibraryOpen}
        onClose={() => setImageLibraryOpen(false)}
        title="Image Library"
        buttons={[
          { label: 'Return to Editor', onClick: () => setImageLibraryOpen(false) },
        ]}
      >
        <ImageSelector close={() => setImageLibraryOpen(false)} />
      </EditorModal>
    </ViewPort>
  )
}

export default Editor
