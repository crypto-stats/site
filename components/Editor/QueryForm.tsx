import InputField from 'components/InputField'
import { useEditorState } from 'hooks/editor-state'
import { useConsole } from 'hooks/console'
import React, { useState } from 'react'
import styled from 'styled-components'
import { LOG_LEVEL } from '@cryptostats/sdk'
import Button from 'components/Button'

const Container = styled.div`
  background-color: #444;
  margin: 16px;
  border-radius: 4px;
`

const TopBar = styled.div`
  font-size: 14px;
  padding: 12px 16px;
  border-radius: 4px;
  border-bottom: solid 1px #636363;

  &:hover {
    cursor: pointer;
    background-color: #565656;
  }
`

const QueryFormInfo = styled.div`
  padding: 16px 16px 0;
`

const Result = styled.pre`
  white-space: pre-wrap;
  font-size: 16px;
  font-weight: medium;
  margin: 8px 0;
`

const InputBlock = styled.div`
  padding: 16px 16px 0;
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

const RunButton = styled(Button)`
  padding: 10px 0;
  background: #d6eaff;
  color: #0477f4;
  border: none;
  border-radius: 4px;
  text-align: center;

  &:hover {
    cursor: pointer;
    color: #fff;
    background-color: #0477f4;
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

const Stat = styled.div`
  font-size: 12px;
  color: #555;
`

interface QueryProps {
  id: string
  fn: (...params: any[]) => Promise<any>
  openByDefault?: boolean
  storageKey: string
}

const functionToParamNames = (fn: Function) => {
  const match = /\(((?:\w+, )*(?:\w+)?)\)/.exec(fn.toString())
  return match ? match[1].split(',').map((name: string) => name.trim()) : []
}

enum STATUS {
  READY,
  RUNNING,
  DONE,
  ERROR,
}

interface State {
  status: STATUS
  result?: string
  error?: string
  time?: number
}

const QueryForm: React.FC<QueryProps> = ({ id, fn, openByDefault, storageKey }) => {
  const fnIsAFunction = typeof fn === 'function'

  const { addLine } = useConsole()
  const [open, setOpen] = useEditorState(`${storageKey}-open`, !!openByDefault)
  const [storedValues, setStoredValues] = useEditorState(
    fnIsAFunction ? `${storageKey}-values` : null,
    JSON.stringify([...new Array(fnIsAFunction ? fn.length : 0)].map(() => ''))
  )
  const [state, setState] = useState<State>({
    status: STATUS.READY,
  })

  if (!fnIsAFunction) {
    return <div>"{id}" is not a function</div>
  }

  const values = JSON.parse(storedValues || '{}')
  const setValues = (newVals: string[]) => setStoredValues(JSON.stringify(newVals))

  const functionNames = functionToParamNames(fn)

  const execute = async () => {
    setState({ status: STATUS.RUNNING })
    try {
      const startTime = Date.now()
      const result = await fn.apply(null, values)
      setState({ status: STATUS.DONE, result, time: Date.now() - startTime })
    } catch (e: any) {
      setState({ status: STATUS.ERROR, error: e.message })
      addLine({ level: LOG_LEVEL.ERROR.toString(), value: e.stack })
    }
  }

  return (
    <Container>
      <TopBar onClick={() => setOpen(!open)}>{id}</TopBar>
      {open && (
        <div>
          <>
            <QueryFormInfo>
              <Label>Fill the parameters below</Label>
            </QueryFormInfo>
            {[...new Array(fn.length)].map((_: any, index: number) => (
              <InputBlock key={index}>
                <Label>{functionNames[index]}</Label>
                <Input
                  value={values[index]}
                  name={functionNames[index]}
                  disabled={state.status === STATUS.RUNNING}
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
            <RunButton onClick={execute} loading={state.status === STATUS.RUNNING} fullWidth>
              Run Query
            </RunButton>
          </RunQueryBtn>
          <Output>
            <Label>Output</Label>
            {state.error && <Error>Error: {state.error}</Error>}
            {state.status === STATUS.DONE && (
              <>
                <Result>{JSON.stringify(state.result, null, 2)}</Result>
                <Stat>Query executed in {state.time! / 1000}s</Stat>
              </>
            )}
          </Output>
        </div>
      )}
    </Container>
  )
}

export default QueryForm
