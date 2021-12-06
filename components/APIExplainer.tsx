import React, { useState } from 'react';
import collectionMetadata, { Parameter, Query } from 'resources/collection-metadata';
import styled from 'styled-components';

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

  const queries = collectionMetadata[listId]?.queries || []

  const selectQuery = (e: any) => setSelectedQuery(parseInt(e.target.value))

  return (
    <div>
      <div>Choose the best way to get data for your site</div>

      <div style={{ margin: '24px 0' }}>
        {queries.map((query: Query, i: number) => (
          <label>
            <div>
              <input type="radio" checked={selectedQuery === i} value={i} onChange={selectQuery} />
              {query.name}
            </div>
            {query.description && <div>{query.description}</div>}
          </label>
        ))}
      </div>

      <SwitchContainer>
        <Switch onClick={() => setMode(MODE.REST)} selected={mode === MODE.REST}>
          <SwitchTitle>REST API</SwitchTitle>
          <SwitchDescription>
            The easiest way to retrieve data is the REST API provided by CryptoStats' centralized server
          </SwitchDescription>
        </Switch>

        <Switch onClick={() => setMode(MODE.SDK)} selected={mode === MODE.SDK}>
          <SwitchTitle>CryptoStats SDK</SwitchTitle>
          <SwitchDescription>
            Ensure uptime by loading data from the decentralized CryptoStats protocol, using the JavaScript SDK
          </SwitchDescription>
        </Switch>
      </SwitchContainer>

      {selectedQuery !== null && (
        <div>
          <div>
            {collectionMetadata[listId]!.queries![selectedQuery].parameters?.map((param: Parameter) => (
              <div>
                <label>
                  {param.name}
                  <input />
                </label>
                {param.description && <div>{param.description}</div>}
              </div>
            ))}
          </div>

          {mode === MODE.REST ? (
            <div>
              <div>
                <div>Request URL</div>
                <div>https://api.cryptostats.community/api/v1/{listId}/{collectionMetadata[listId]!.queries![selectedQuery].id}</div>
              </div>

              <div>
                <div>CURL</div>
                <div>curl https://api.cryptostats.community/api/v1/{listId}/{collectionMetadata[listId]!.queries![selectedQuery].id}</div>
              </div>
            </div>
          ) : (
            <div>
              <pre>yarn add @cryptostats/sdk</pre>
              <pre>{`
    const { CryptoStatsSDK } = require('@cryptostats/sdk');

    (async function() {
      const sdk = new CryptoStatsSDK();
      const list = sdk.getList('${listId}');
      await list.fetchAdapters();
    })`}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default APIExplainer;
