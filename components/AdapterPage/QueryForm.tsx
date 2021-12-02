import React, { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
`

const TopBar = styled.div`
  font-size: 16px;
  font-weight: bold;
  border-bottom: solid 1px #ddd;
  padding: 6px 0;
  margin-bottom: 14px;
  cursor: pointer;

  &:hover {
    background: #eee;
  }
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
  font-size: 16px;
  font-weight: 500;
  color: #002750;
`

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: solid 1px #ddd;
  font-size: 14px;
  color: #818181;
  outline: none;
`

const RunButton = styled.button`
  height: 35px;
  padding: 8px 20px;
  border-radius: 4px;
  border: solid 1px #0477f4;
  background-color: transparent;
  margin: 8px 0;
  color: #0477f4;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background: #eee;
  }

  &:disabled {
    color: #999;
    background: transparent;
    border: solid 1px #ccc;
  }
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
