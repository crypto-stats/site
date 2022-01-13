import InputField from 'components/InputField'
import Text from 'components/Text'
import { usePlausible } from 'next-plausible'
import React, { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background-color: var(--color-white);
  border-radius: 4px;

  & + & {
    margin-top: 16px;
  }
`

const TopBar = styled.div<{ open?: boolean }>`
  font-size: 14px;
  padding: 12px 16px;
  border-radius: 4px;
  border: solid 1px var(--color-primary-800);

  ${({ open }) => open ? `
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
  ` : ``}

  &:hover {
    cursor: pointer;
    background-color: var(--color-primary-400);
  }
`

const QueryFormContainer = styled.div`
  border: 1px solid var(--color-primary-800);
  border-top: none;
  padding-top: 16px;
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

const Input = styled(InputField)`
  width: 100%;
  width: -webkit-fill-available;
  padding: 8px 0px 8px 16px;
  border-radius: 4px;
  border: solid 1px var(--color-primary-800);
  background-color: var(--color-white);
  font-size: 14px;
  color: var(--color-dark-500);
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
  transition: var(--transition-fast);

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
  background-color: var(--color-primary-300);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
`

const Error = styled.div`
  font-size: 14px;
  color: red;
`


interface QueryProps {
  id: string;
  fn: (...params: any[]) => Promise<any>;
  adapter: string
  openByDefault?: boolean
}

const functionToParamNames = (fn: Function) => {
  const match = /\(((?:\w+, )*(?:\w+)?)\)/.exec(fn.toString())
  return match ? match[1].split(',').map((name: string) => name.trim()) : []
}

const QueryForm: React.FC<QueryProps> = ({ id, fn, openByDefault, adapter }) => {
  const plausible = usePlausible()
  const [open, setOpen] = useState(!!openByDefault)
  const [values, setValues] = useState([...new Array(fn.length)].map(() => ''))
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const functionNames = functionToParamNames(fn)

  const execute = async () => {
    setRunning(true)

    plausible('execute-adapter-query', {
      props: {
        adapter,
        query: id,
      },
    })

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
      <TopBar onClick={() => setOpen(!open)} open={open}>{id}</TopBar>
      {open && (
        <QueryFormContainer>
        <>
          {[...new Array(fn.length)].map((_: any, index: number) => (
            <InputBlock key={index}>
              <Text tag="p" type="label">{functionNames[index]}</Text>
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
          <Text tag="p" type="label">Output</Text>
          {error ? (
            <Error>Error: {error}</Error>
          ) : (
            <Result>{JSON.stringify(result, null, 2)}</Result>
          )}
        </Output>
      </QueryFormContainer>
      )}
    </Container>
  )
}

export default QueryForm
