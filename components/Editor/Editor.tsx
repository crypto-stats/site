import React, { useState, useEffect } from 'react'
import { ViewPort, Top, LeftResizable, Fill, RightResizable, Bottom } from 'react-spaces'
import styled from 'styled-components'
import CodeEditor from 'components/CodeEditor'
import FileList from 'components/FileList'
import { useAdapter, newModule } from 'hooks/local-adapters'
import { useCompiler } from 'hooks/compiler'
import PrimaryFooter from './PrimaryFooter'
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

const PrimaryFooterContainer = styled(Bottom)`
  border-top: solid 1px #444447;
  display: flex;
  background: #2f2f2f;
`

const Editor: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null)
  const [started, setStarted] = useState(false)
  const { save, adapter } = useAdapter(fileName)
  const { evaluate, module } = useCompiler()

  useEffect(() => {
    if (module && module.name !== adapter.name) {
      const name = module.name && module.name.length > 0 ? module.name : 'Unnamed Adapter'
      save(adapter.code, name)
    }
  }, [module])

  useEffect(() => {
    setStarted(true)
  }, [])
  if (!started) {
    return null
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
            {fileName && adapter && (
              <CodeEditor
                fileId={fileName}
                defaultValue={adapter.code}
                onChange={(code: string) => save(code, adapter.name)}
                onValidated={(code: string) => evaluate(code, true)}
              />
            )}
          </Fill>

          <RightResizable size={200}>
            <RightPanel />
          </RightResizable>

          <PrimaryFooterContainer size={55}>
            <PrimaryFooter fileName={fileName} />
          </PrimaryFooterContainer>
        </Fill>
      </Fill>
    </ViewPort>
  )
}

export default Editor
