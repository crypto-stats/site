import React, { useState } from 'react'
import { LOG_LEVEL } from '@cryptostats/sdk'
import collectionMetadata, { Parameter, Query } from 'resources/collection-metadata';
import styled from 'styled-components'
import Button from './Button';
import InputField from './InputField'
import { usePlausible } from 'next-plausible';
import { getSDK } from 'utils/sdk';
import Text from "components/Text"


const SectionWrapper = styled.section<{noMargin?: boolean}>`
  padding: 32px 40px;

  ${({noMargin}) => noMargin ? 'padding: 0 40px;' : ''}
`

const SectionHighlight = styled(SectionWrapper)`
  background-color: var(--color-primary-400);
`


const QueryContainer = styled.div`

`

const QueryLabel = styled.label`
  display: flex;
  padding: 16px;
  align-items: center;
  background-color: white;
  border: 1px solid #ddd;
  cursor: pointer;
`

const CheckBtn = styled.input`
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

const RadioBtn = styled(CheckBtn)`
  border-radius: 100%;

  &:before {
    border-radius: 100%;
  }  
`

const QueryDescription = styled.div`
  font-size: 16px;
  color: #818181;
`

const ParamInputBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 16px 30px;
  background: #eef1f7;
  border: 1px solid #ddd;
  border-top: none;
`

const ParamInputLabel = styled.div`
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
  max-width: 100%;
  overflow-x: scroll;
  margin-bottom: 32px;
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
  const queries = collectionMetadata[listId]?.queries || []

  const plausible = usePlausible()
  const [mode, setMode] = useState<MODE>(MODE.REST)
  const [selectedQuery, setSelectedQuery] = useState<null | number>(queries.length === 1 ? 0 : null)
  const [paramValues, setParamValues] = useState<string[]>([])
  const [executing, setExecuting] = useState(false)
  const [output, setOutput] = useState('')
  const [includeMetadata, setIncludeMetadata] = useState(false)

  const changeMode = (newMode: MODE) => {
    setMode(newMode)
    setOutput('')
  }

  const appendOutput = (output: string) => setOutput((_output: string) => `${_output}\n${output}`)

  const selectQuery = (e: any) => setSelectedQuery(parseInt(e.target.value))

  let url = ''
  let queryId = ''
  if (selectedQuery !== null) {
    queryId = queries![selectedQuery].id
    url = `https://api.cryptostats.community/api/v1/${listId}/${queryId}`
    if (paramValues.length > 0) {
      url += '/' + paramValues.join(',')
    }

    if (!includeMetadata) {
      url += '?metadata=false'
    }
  }

  const execute = async () => {
    setExecuting(true)
    setOutput('')

    plausible('execute-collection-query', {
      props: {
        mode: MODE[mode],
        listId,
        query: queries![selectedQuery!].id,
      },
    })

    try {
      if (mode === MODE.REST) {
        const req = await fetch(url)
        const json = await req.json()
        setOutput(JSON.stringify(json, null, 2))
      } else {
        appendOutput('Initializing CryptoStats SDK')

        const sdk = getSDK({
          onLog: (level: LOG_LEVEL, ...args: any[]) =>
            appendOutput(`${LOG_LEVEL[level]}: ${args.map((arg: any) => JSON.stringify(arg)).join(' ')}`)
        })

        appendOutput(`Fetching ${listId} collection from on-chain & IPFS`)
        const collection = sdk.getCollection(listId)
        await collection.fetchAdapters()

        const queryId = queries[selectedQuery!].id
        appendOutput(`Executing ${queryId} query`)
        const result = includeMetadata
          ? await collection.executeQueryWithMetadata(queryId, ...paramValues)
          : await collection.executeQuery(queryId, ...paramValues)

        collection.cleanupModules()

        appendOutput(`\nResult: \n${JSON.stringify(result, null, 2)}`)
      }
    } catch (e: any) {
      console.warn(e)
      appendOutput(`\nError: ${e.message}`)
    }
    setExecuting(false)
  }

  return (
    <>
      <SectionWrapper noMargin>
        <Text tag="p" type="label" mb="16">Select queries</Text>
      </SectionWrapper>

      <SectionHighlight>
        <Text tag="p" type="content_big">Queries &amp; Parameters</Text>
        <div style={{ margin: '12px 0' }}>
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
        <div style={{ marginBottom: '12px' }}>
          <QueryLabel>
            <CheckBtn type="checkbox" checked={includeMetadata} onChange={(e: any) => setIncludeMetadata(e.target.checked)} />
            Include metadata
          </QueryLabel>
        </div>
      </SectionHighlight>

      <SectionWrapper>

        <Text tag="p" type="label" mb="16">Select how you want to pull the data</Text>

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
              <div style={{ marginBottom: '32px' }}>
                <>
                  <Text tag="p" type="label" mt="24" mb="16">Request URL</Text>
                  <CopyField readOnly value={url} />
                </>

                <>
                  <Text tag="p" type="label" mt="24" mb="16">CURL</Text>
                  <CopyField readOnly value={`curl ${url}`} />
                </>
              </div>
            ) : (
              <div>
                <Text tag="p" type="label" mt="24" mb="16">1. Install CryptoStats SDK</Text>
                <CopyField value="yarn add @cryptostats/sdk" readOnly />
                <Text tag="p" type="label" mt="24" mb="16">2. Import SDK, fetch adapters and execute query</Text>
                <CodeField>{`const { CryptoStatsSDK } = require('@cryptostats/sdk');

  (async function() {
    const sdk = new CryptoStatsSDK({
      moralisKey: <your key>,
    });
    const list = sdk.getCollection('${listId}');
    await list.fetchAdapters();

    const result = await list.${includeMetadata ? 'executeQueryWithMetadata' : 'executeQuery'}(${[queryId, ...paramValues].map(val => JSON.stringify(val)).join(', ')});
    console.log(result);
  })()`}</CodeField>
              </div>
            )}
            
            <Button onClick={execute} disabled={executing} centered>Execute query</Button>
            <Text tag="p" type="label" mt="24" mb="16">Preview output</Text>
            <Output>{output}</Output>
            </div>
          )}
      </SectionWrapper>
    </>
  )
}

export default APIExplainer;
