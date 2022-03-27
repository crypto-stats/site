import React, { useLayoutEffect, useRef } from 'react'
import styled from 'styled-components'
import { Fill } from 'react-spaces'
import { useConsole, Line } from 'hooks/console'
import { LOG_LEVEL } from '@cryptostats/sdk'

const ConsoleView = styled(Fill)`
  padding: 8px;
  color: #ffffff;
  font-size: 12px;
`

const ConsoleLine = styled.div<{ level: string }>`
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;

  ${({ level }) => (level === LOG_LEVEL.ERROR.toString() ? 'color: red;' : '')}
`

const Console: React.FC = () => {
  const { lines } = useConsole()
  const bottomRef = useRef<any>(null)

  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [bottomRef.current, lines])

  return (
    <ConsoleView scrollable={true}>
      {lines.map((line: Line, i: number) => (
        <ConsoleLine key={i} level={line.level}>
          {line.value}
        </ConsoleLine>
      ))}
      <div ref={bottomRef} />
    </ConsoleView>
  )
}

export default Console
