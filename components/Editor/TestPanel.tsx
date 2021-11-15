import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Fill, BottomResizable, Top } from 'react-spaces'
import { Adapter } from '@cryptostats/sdk'
import { useCompiler } from 'hooks/compiler'
import { useConsole, Line } from 'hooks/console'
import SubAdapterTest from './SubAdapterTest'

const Container = styled(Fill)`
  > .spaces-resize-handle {
    border-top: solid 2px #4a4a4d;
    box-sizing: border-box;
  }
`

const Main = styled(Fill)`
  padding: 16px;
`

const ConsoleTop = styled(Top)`
  background: #2f2f2f;
  display: flex;
  align-items: center;
  padding: 0 8px;
  justify-content: space-between;
`

const ConsoleView = styled(Fill)`
  padding: 8px;
`

const ConsoleLine = styled.div`
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
`

const PreviewPanel: React.FC = () => {
  const { module, list, processing } = useCompiler()
  const { lines, clear: clearConsole } = useConsole()
  const bottomRef = useRef<any>(null)

  useEffect(() => {
    if (bottomRef) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [bottomRef, lines])

  if (!module) {
    if (processing) {
      return <div>Building adapter...</div>
    } else {
      return <div>Unable to build adapter</div>
    }
  }

  return (
    <Container>
      <Main scrollable={true}>
        {list && list.adapters.map((adapter: Adapter) => (
          <SubAdapterTest
            key={adapter.id}
            subadapter={adapter}
            openByDefault={list.adapters.length === 1}
          />
        ))}
      </Main>

      <BottomResizable size={100}>
        <ConsoleTop size={40}>
          Console
          <div>
            <button onClick={clearConsole}>Clear</button>
          </div>
        </ConsoleTop>
        <ConsoleView scrollable={true}>
          {lines.map((line: Line, i: number) => (
            <ConsoleLine key={i}>{line.value}</ConsoleLine>
          ))}
          <div ref={bottomRef} />
        </ConsoleView>
      </BottomResizable>
    </Container>
  )
}

export default PreviewPanel
