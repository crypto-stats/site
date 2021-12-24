import InputField from 'components/InputField'
import React, { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background-color: #444;
  margin: 16px;
  border-radius: 4px;
`

const TopBar = styled.div`
  font-size: 16px;
  padding: 12px 16px;
  border-radius: 4px;
  border-bottom: solid 1px #636363;

  &:hover {
    cursor: pointer;
    background-color: #565656;
  }
`

const Result = styled.pre`
  white-space: pre-wrap;
  font-size: 16px;
  font-weight: medium;
  margin: 8px 0;
`

const InputBlock = styled.div`
  padding: 24px 16px 0;
`

const Label = styled.div`
  font-size: 14px;
  color: #9d9d9d;
`

const Input = styled(InputField)`
  width: 100%;
  width: -webkit-fill-available;
  padding: 8px 0px 8px 16px;
  border-radius: 4px;
  border: solid 1px #424242;
  background-color: #1a1919;
  font-size: 14px;
  color: #b5b6b9;
  margin-top: 8px;
  outline: none;
`

const RunButton = styled.button`
  width: 100%;
  padding: 10px 0;
  background: #D6EAFF;
  color: #0477F4;
  border: none;
  border-radius: 4px;
  text-align: center;
  outline: none;

  &:hover {
    cursor: pointer;
    color: #fff;
    background-color: #0477F4;
  }
`

const RunQueryBtn = styled.div`
  padding: 24px 16px;
`
const Output = styled.div`
  padding: 16px;
  background-color: #000;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
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
          <>
            {[...new Array(fn.length)].map((_: any, index: number) => (
              <InputBlock key={index}>
                <Label>{functionNames[index]}</Label>
                <Input
                  value={values[index]}
                  name={functionNames[index]}
                  disabled={running}
                  onChange={(newValue: string) => {
                    const newValues = [...values]
                    newValues[index] = newValue
                    setValues(newValues)
                  }}
                />
              </InputBlock>
            ))}
          </>
          <RunQueryBtn>
            <RunButton onClick={execute} disabled={running}>Run Query</RunButton>
          </RunQueryBtn>
          <Output>
            <Label>Output</Label>
            {error ? (
              <Error>Error: {error}</Error>
            ) : (
              <Result>{JSON.stringify(result, null, 2)}</Result>
            )}
          </Output>
        </div>
      )}
    </Container>
  )
}

export default QueryForm
