import React, { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background-color: #444;
  padding: 12px 16px;
`

const TopBar = styled.div``

interface QueryProps {
  id: string;
  fn: (...params: any[]) => Promise<any>;
  openByDefault?: boolean
}

const functionToParamNames = (fn: Function) => {
  const match = /\(((?:\w+, )*(?:\w+)?)\)/.exec(fn.toString())
  return match ? match[1].split(',').map((name: string) => name.trim()) : []
}

const QueryForm: React.FC<QueryProps> = ({ id, fn, openByDefault }) => {
  const [open, setOpen] = useState(!!openByDefault)
  const [values, setValues] = useState([...new Array(fn.length)].map(() => ''))
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const functionNames = functionToParamNames(fn)

  const execute = async () => {
    setRunning(true)
    try {
      setResult(null)
      setError(null)
      const newResult = await fn.apply(null, values)
      setResult(newResult)
    } catch (e) {
      setError(e.message)
    }
    setRunning(false)
  }

  return (
    <Container>
      <TopBar onClick={() => setOpen(!open)}>{id}</TopBar>
      {open && (
        <div>
          <div>Input</div>
          <div>
            {[...new Array(fn.length)].map((_: any, index: number) => (
              <input
                key={index}
                value={values[index]}
                placeholder={functionNames[index]}
                disabled={running}
                onChange={(e: any) => {
                  const newValues = [...values]
                  newValues[index] = e.target.value
                  setValues(newValues)
                }}
              />
            ))}
          </div>
          <button onClick={execute} disabled={running}>Run Query</button>
          <div>Output</div>
          {result && <pre>{result}</pre>}
          {error && <div>Error: {error}</div>}
        </div>
      )}
    </Container>
  )
}

export default QueryForm
