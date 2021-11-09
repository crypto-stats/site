import React, { useState, useEffect } from 'react'
import CodeEditor from 'components/CodeEditor'
import styled from 'styled-components'
import FileList from 'components/FileList'
import { useAdapter, newModule } from 'hooks/local-adapters'
import { ViewPort, Top, LeftResizable, Fill, RightResizable, Bottom } from 'react-spaces'
import { useCompiler } from 'hooks/compiler'
import RightPanel from './RightPanel'

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
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  font-weight: 600;
  color: white;
`

const NewAdapterButton = styled.button``

const LeftFooter = styled(Bottom)`
  border-top: solid 1px #444447;
`

const PrimaryFooter = styled(Bottom)`
  border-top: solid 1px #444447;
  display: flex;
  justify-content: space-between;
  background: #2f2f2f;
`

const PublishButton = styled.button`
  height: 35px;
  margin: 0 0 0 32px;
  padding: 9px 20px;
  border-radius: 4px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
  color: white;
  background: #0477f4;
  border: none;
`

const Editor: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)
  const { save, publish: publishToIPFS, adapter } = useAdapter(fileName)
  const { evaluate } = useCompiler()

  useEffect(() => {
    setFileName('8a0c')
  }, [])
  if (!fileName || !adapter) {
    return null;
  }

  const publish = async () => {
    setPublishing(true)
    try {
      await publishToIPFS(adapter.code, adapter.name)
    } catch (e) {
      console.warn(e)
    }
    setPublishing(false)
  }

  return (
    <ViewPort style={{ background: '#0f1011' }}>
      <Header size={64} order={1}>
        <CloseButton>Close</CloseButton>
      </Header>
      <Fill>
        <Left size={200}>
          <Fill>
            <FileList selected={fileName} onSelected={setFileName} />
          </Fill>

          <Bottom size={30}>
            <NewAdapterButton onClick={() => setFileName(newModule())}>New Adapter</NewAdapterButton>
          </Bottom>

          <LeftFooter order={1} size={55} style={{ borderTop: 'solid 1px #444447' }} />
        </Left>

        <Fill>
          <Top size={30}>
            Top
          </Top>

          <Fill>
            <CodeEditor
              fileId={fileName}
              defaultValue={adapter.code}
              onChange={(code: string) => save(code, adapter.name)}
              onValidated={(code: string) => evaluate(code, true)}
            />
          </Fill>

          <RightResizable size={200}>
            <RightPanel />
          </RightResizable>

          <PrimaryFooter size={55}>
            <div />
            <div>
              <PublishButton disabled={publishing} onClick={publish}>Publish to IPFS</PublishButton>
            </div>
          </PrimaryFooter>
        </Fill>
      </Fill>
    </ViewPort>
  )
}

export default Editor
