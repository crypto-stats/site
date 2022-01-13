import React, { useLayoutEffect, useRef } from 'react'
import styled from 'styled-components'
import { Fill } from 'react-spaces'
import { useConsole, Line } from 'hooks/console'

const ConsoleView = styled(Fill)`
  padding: 8px;
  color: #ffffff;
`

const ConsoleLine = styled.div`
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
`

const Console: React.FC = () => {
  const { lines } = useConsole()
  const bottomRef = useRef<any>(null)

  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [bottomRef.current, lines])

  return (
    <ConsoleView scrollable={true}>
      {lines.map((line: Line, i: number) => (
        <ConsoleLine key={i}>{line.value}</ConsoleLine>
      ))}
      <div ref={bottomRef} />
    </ConsoleView>
  )
}

export default Console
