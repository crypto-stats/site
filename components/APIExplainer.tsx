import React, { useState } from 'react';
import collectionMetadata, { Parameter, Query } from 'resources/collection-metadata';
import styled from 'styled-components'
import InputField from './InputField'

const SwitchContainer = styled.div`
  display: inline-flex;
  background: #9e39ac;
  border-radius: 4px;
  padding: 1px;
`

const Switch = styled.button<{ selected: boolean }>`
  flex: 1 0 0;
  display: flex;
  flex-direction: column;
  background: transparent;
  border: none;
  align-items: center;
  padding: 8px;

  ${({ selected }) => selected && `
    background: #d6eaff;
  `}
`

const SwitchTitle = styled.div`
  font-size: 18px;
  margin-bottom: 8px;
`

const SwitchDescription = styled.div``

const CopyField = styled.input`
  display: block;
  width: 100%;
`

const Output = styled.pre`
  overflow-x: auto;
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
        const { CryptoStatsSDK, LOG_LEVEL } = await import('@cryptostats/sdk')
        const sdk = new CryptoStatsSDK({
          moralisKey: process.env.NEXT_PUBLIC_MORALIS_KEY,
          adapterListSubgraph: 'dmihal/cryptostats-adapter-registry-test',
          onLog: (level: LOG_LEVEL, ...args: any[]) =>
            appendOutput(`${LOG_LEVEL[level]}: ${args.map((arg: any) => JSON.stringify(arg)).join(' ')}`)
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
      <div>Choose the best way to get data for your site</div>

      <div style={{ margin: '24px 0' }}>
        {queries.map((query: Query, i: number) => (
          <label key={query.id}>
            <div>
              <input type="radio" checked={selectedQuery === i} value={i} onChange={selectQuery} />
              {query.name}
            </div>
            {query.description && <div>{query.description}</div>}
          </label>
        ))}
      </div>

      <SwitchContainer>
        <Switch onClick={() => changeMode(MODE.REST)} selected={mode === MODE.REST}>
          <SwitchTitle>REST API</SwitchTitle>
          <SwitchDescription>
            The easiest way to retrieve data is the REST API provided by CryptoStats' centralized server
          </SwitchDescription>
        </Switch>

        <Switch onClick={() => changeMode(MODE.SDK)} selected={mode === MODE.SDK}>
          <SwitchTitle>CryptoStats SDK</SwitchTitle>
          <SwitchDescription>
            Ensure uptime by loading data from the decentralized CryptoStats protocol, using the JavaScript SDK
          </SwitchDescription>
        </Switch>
      </SwitchContainer>

      {selectedQuery !== null && (
        <div>
          <div>
            {queries[selectedQuery].parameters?.map((param: Parameter, i: number, list: Parameter[]) => (
              <div key={param.name}>
                <label>
                  {param.name}
                  <InputField
                    name={param.name}
                    value={paramValues[i] || ''}
                    onChange={(newVal: any) => setParamValues((_currentVals: string[]) => {
                      const newParamList = []
                      for (let j = 0; j < list.length; j += 1) {
                        if (i === j) {
                          newParamList.push(newVal)
                        } else {
                          newParamList.push(_currentVals[j] || null)
                        }
                      }
                      return newParamList
                    })}
                  />
                </label>
                {param.description && <div>{param.description}</div>}
              </div>
            ))}
          </div>

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
              <pre>{`
const { CryptoStatsSDK } = require('@cryptostats/sdk');

(async function() {
  const sdk = new CryptoStatsSDK({
    moralisKey: <your key>,
    adapterListSubgraph: 'dmihal/cryptostats-adapter-registry-test',
  });
  const list = sdk.getList('${listId}');
  await list.fetchAdapters();

  const result = await list.executeQuery(queryId, ...paramValues);
  console.log(result);
})`}</pre>
            </div>
          )}

          <div>Preview</div>
          <button onClick={execute} disabled={executing}>Execute query</button>
          <div>Output</div>
          <Output>{output}</Output>
        </div>
      )}
    </div>
  )
}

export default APIExplainer;
