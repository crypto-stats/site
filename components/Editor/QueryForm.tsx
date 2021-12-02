import React, { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background-color: #444;
  padding: 12px 16px;
`

const TopBar = styled.div`
  font-size: 14px;
  border-bottom: solid 1px #636363;
  padding: 6px 0;
  margin-bottom: 14px;
`

const Result = styled.pre`
  white-space: pre-wrap;
  font-size: 14px;
  min-height: 30px;
  margin: 4px 0;
`

const InputBlock = styled.div`
  display: flex;
  flex-direction: column;
`

const Label = styled.div`
  font-size: 14px;
  color: #9d9d9d;
`

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: solid 1px #424242;
  background-color: #1a1919;
  font-size: 14px;
  color: #b5b6b9;
  outline: none;
`

const RunButton = styled.button`
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

const Error = styled.div`
  font-size: 14px;
  color: #cf9b9b;
`

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
    } catch (e: any) {
      setError(e.message)
    }
    setRunning(false)
  }

  return (
    <Container>
      <TopBar onClick={() => setOpen(!open)}>{id}</TopBar>
      {open && (
        <div>
          <div>
            {[...new Array(fn.length)].map((_: any, index: number) => (
              <InputBlock key={index}>
                <Label>{functionNames[index]}</Label>
                <Input
                  value={values[index]}
                  placeholder={functionNames[index]}
                  disabled={running}
                  onChange={(e: any) => {
                    const newValues = [...values]
                    newValues[index] = e.target.value
                    setValues(newValues)
                  }}
                />
              </InputBlock>
            ))}
          </div>
          <RunButton onClick={execute} disabled={running}>Run Query</RunButton>
          <Label>Output</Label>
          {error ? (
            <Error>Error: {error}</Error>
          ) : (
            <Result>{result}</Result>
          )}
        </div>
      )}
    </Container>
  )
}

export default QueryForm
