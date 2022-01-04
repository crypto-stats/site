import React, { useRef, useLayoutEffect } from 'react'
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
  
`

const ConsoleTop = styled(Top)`
  background: #2f2f2f;
  display: flex;
  align-items: center;
  padding: 0 8px;
  justify-content: space-between;
`

const ClearButton = styled.button`
  height: 20px;
  padding: 3px 0 2px;
  border-radius: 4px;
  border: solid 1px #ffffff;
  background-color: transparent;
  margin: 16px 0 6px;
  color: white;
  padding: 2px 16px;

  &:hover {
    background: #363636;
  }
`

const ConsoleView = styled(Fill)`
  padding: 8px;
`

const Label = styled.div`
  font-size: 14px;
  color: #6B6B6B;
  letter-spacing: 1.1px;
  text-transform: uppercase;
  margin: 16px;
`


const ConsoleLine = styled.div`
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
`

const TabContentIntro = styled.div`
  font-size: 14px;
  color: #808080;
  line-height: 19px;
  margin: 16px 16px 24px;
`

const PreviewPanel: React.FC = () => {
  const { module, list, processing } = useCompiler()
  const { lines, clear: clearConsole } = useConsole()
  const bottomRef = useRef<any>(null)

  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [bottomRef.current, lines])

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
        <TabContentIntro>In order to publish your Adapter you need to test the query you wrote.</TabContentIntro>
        <Label>Queries to test</Label>
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
            <ClearButton onClick={clearConsole}>Clear</ClearButton>
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
