import React, { useState } from 'react'
import type { LOG_LEVEL } from '@cryptostats/sdk'
import collectionMetadata, { Parameter, Query } from 'resources/collection-metadata';
import styled from 'styled-components'
import Button from './Button';
import InputField from './InputField'

const Section = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 30px 0;
`

const SubSection = styled.h4`
  font-size: 14px;
  color: #6b6b6b;
`

const QueryContainer = styled.div`
  border: solid 1px #ddd;
  border-bottom: none;

  &:last-child {
    border-bottom: solid 1px #ddd;
  }
`

const QueryLabel = styled.label`
  padding: 20px;
  background: #ffffff;
  display: flex;
`

const RadioBtn = styled.input`
  appearance: none;
  margin: 0;

  width: 16px;
  height: 16px;
  border: solid 1px #979797;

  display: grid;
  place-content: center;
  margin-right: 14px;

  &:before {
    content: "";
    width: 10px;
    height: 10px;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    background-color: #0477f4;
  }

  &:checked:before {
    transform: scale(1);
  }

  &:focus {
    background: #eee;
  }
`

const QueryDescription = styled.div`
  font-size: 16px;
  color: #818181;
`

const ParamInputBox = styled.div`
  padding: 16px 30px;
  display: flex;
  flex-wrap: wrap;
  background: #eef1f7;
  border-top: solid 1px #ddd;
`

const ParamInputLabel = styled.label`
  width: 300px;
  display: flex;
  flex-direction: column;
  margin-right: 16px;
`

const ParamInput = styled(InputField)`
  width: 100%;
  box-sizing: border-box;
  border: solid 1px #ccc;
  padding: 8px 16px;
  border-radius: 4px;
  margin: 8px 0;
`

const ParamDescription = styled.div`
  font-size: 14px;
  color: #818181;
`

const SwitchContainer = styled.div`
  display: inline-flex;
  background: #eef1f7;
  border-radius: 4px;
  padding: 6px;
`

const Switch = styled.button<{ selected: boolean }>`
  flex: 1 0 0;
  display: flex;
  flex-direction: column;
  background: transparent;
  border: solid 1px transparent;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  margin: 2px;

  ${({ selected }) => selected ? `
    border: solid 1px #ddd;
    background-color: #ffffff;
  ` : `
    &:hover {
      cursor: pointer;
      background-color: #dee3ed;
    }
  `}
`

const SwitchTitle = styled.div<{ selected: boolean }>`
  font-size: 16px;
  margin-bottom: 8px;
  font-weight: bold;
  color: ${({ selected }) => selected ? '#0477f4' : '#262626'};
`

const SwitchDescription = styled.div`
  color: #002750;
`

const CopyField = styled.input`
  display: block;
  width: 100%;
  padding: 16px;
  border-radius: 4px;
  border: solid 1px #ddd;
  background-color: #f9f9f9;
  font-size: 16px;
  font-weight: 500;
  color: #717d8a;
  box-sizing: border-box;
  outline: none;
`

const CodeField = styled.pre`
  padding: 16px;
  background-color: #f9f9f9;
  color: #717d8a;
  border: solid 1px #ddd;
`

const Output = styled.pre`
  overflow-x: auto;
  border-radius: 4px;
  border: solid 1px #151a20;
  background-color: #404c59;
  color: #ffffff;
  padding: 32px;
`

interface APIExplainerProps {
  listId: string
}

enum MODE {
  REST,
  SDK,
}

const APIExplainer: React.FC<APIExplainerProps> = ({ listId }) => {
  const [mode, setMode] = useState<MODE>(MODE.REST)
  const [selectedQuery, setSelectedQuery] = useState<null | number>(null)
  const [paramValues, setParamValues] = useState<string[]>([])
  const [executing, setExecuting] = useState(false)
  const [output, setOutput] = useState('')

  const changeMode = (newMode: MODE) => {
    setMode(newMode)
    setOutput('')
  }

  const appendOutput = (output: string) => setOutput((_output: string) => `${_output}\n${output}`)

  const queries = collectionMetadata[listId]?.queries || []

  const selectQuery = (e: any) => setSelectedQuery(parseInt(e.target.value))

  let url = ''
  if (selectedQuery !== null) {
    url = `https://staging.api.cryptostats.community/api/v1/${listId}/${queries![selectedQuery].id}`
    if (paramValues.length > 0) {
      url += '/' + paramValues.join(',')
    }
  }

  const execute = async () => {
    setExecuting(true)
    setOutput('')
    try {
      if (mode === MODE.REST) {
        const req = await fetch(url)
        const json = await req.json()
        setOutput(JSON.stringify(json, null, 2))
      } else {
        appendOutput('Initializing CryptoStats SDK')
        const { CryptoStatsSDK, LOG_LEVEL: logLevel } = await import('@cryptostats/sdk')
        const sdk = new CryptoStatsSDK({
          moralisKey: process.env.NEXT_PUBLIC_MORALIS_KEY,
          adapterListSubgraph: 'dmihal/cryptostats-adapter-registry-test',
          onLog: (level: LOG_LEVEL, ...args: any[]) =>
            appendOutput(`${logLevel[level]}: ${args.map((arg: any) => JSON.stringify(arg)).join(' ')}`)
        })

        appendOutput(`Fetching ${listId} collection from on-chain & IPFS`)
        const list = sdk.getList(listId)
        await list.fetchAdapters()

        const queryId = queries[selectedQuery!].id
        appendOutput(`Executing ${queryId} query`)
        const result = await list.executeQuery(queryId, ...paramValues)

        appendOutput(`\nResult: \n${JSON.stringify(result, null, 2)}`)
      }
    } catch (e: any) {
      console.warn(e)
      appendOutput(`\nError: ${e.message}`)
    }
    setExecuting(false)
  }

  return (
    <div>
      <Section>Queries & Parameters</Section>

      <div style={{ margin: '24px 0' }}>
        {queries.map((query: Query, i: number) => {
          const selected = selectedQuery === i
          const params = query.parameters || []
          return (
            <QueryContainer key={query.id}>
              <QueryLabel>
                <RadioBtn type="radio" checked={selected} value={i} onChange={selectQuery} />
                <div>
                  <div>{query.name} ({query.id})</div>
                  {query.description && <QueryDescription>{query.description}</QueryDescription>}
                </div>
              </QueryLabel>

              {selected && params.length > 0 && (
                <ParamInputBox>
                  {params.map((param: Parameter, i: number) => (
                    <ParamInputLabel key={param.name}>
                      {param.name}
                      <ParamInput
                        name={param.name}
                        value={paramValues[i] || ''}
                        onChange={(newVal: any) => setParamValues((_currentVals: string[]) => {
                          const newParamList = []
                          for (let j = 0; j < params.length; j += 1) {
                            if (i === j) {
                              newParamList.push(newVal)
                            } else {
                              newParamList.push(_currentVals[j] || null)
                            }
                          }
                          return newParamList
                        })}
                      />
                      {param.description && <ParamDescription>{param.description}</ParamDescription>}
                    </ParamInputLabel>
                  ))}
                </ParamInputBox>
              )}
            </QueryContainer>
          )
        })}
      </div>

      <SwitchContainer>
        <Switch onClick={() => changeMode(MODE.REST)} selected={mode === MODE.REST}>
          <SwitchTitle selected={mode === MODE.REST}>REST API</SwitchTitle>
          <SwitchDescription>
            The easiest way to retrieve data is the REST API provided by CryptoStats' centralized server
          </SwitchDescription>
        </Switch>

        <Switch onClick={() => changeMode(MODE.SDK)} selected={mode === MODE.SDK}>
          <SwitchTitle selected={mode === MODE.SDK}>CryptoStats SDK</SwitchTitle>
          <SwitchDescription>
            Ensure uptime by loading data from the decentralized CryptoStats protocol, using the JavaScript SDK
          </SwitchDescription>
        </Switch>
      </SwitchContainer>

      {selectedQuery !== null && (
        <div>
          {mode === MODE.REST ? (
            <div>
              <div>
                <div>Request URL</div>
                <CopyField readOnly value={url} />
              </div>

              <div>
                <div>CURL</div>
                <CopyField readOnly value={`curl ${url}`} />
              </div>
            </div>
          ) : (
            <div>
              <div>1. Install CryptoStats SDK</div>
              <CopyField value="yarn add @cryptostats/sdk" readOnly />
              <div>2. Import SDK, fetch adapters and execute query</div>
              <CodeField>{`const { CryptoStatsSDK } = require('@cryptostats/sdk');

(async function() {
  const sdk = new CryptoStatsSDK({
    moralisKey: <your key>,
    adapterListSubgraph: 'dmihal/cryptostats-adapter-registry-test',
  });
  const list = sdk.getList('${listId}');
  await list.fetchAdapters();

  const result = await list.executeQuery(queryId, ...paramValues);
  console.log(result);
})`}</CodeField>
            </div>
          )}

          <div>Preview</div>
          <Button onClick={execute} disabled={executing}>Execute query</Button>
          <SubSection>Output</SubSection>
          <Output>{output}</Output>
        </div>
      )}
    </div>
  )
}

export default APIExplainer;
