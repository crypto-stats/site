import React, { useState } from 'react';
import styled from 'styled-components';

const SwitchContainer = styled.div`
  display: inline-flex;
  background: #9e39ac;
  border-radius: 4px;
  padding: 1px;
`

const Switch = styled.button<{ selected: boolean }>`
  flex: 0 0 200px;
  display: flex;
  flex-direction: column;
  background: transparent;
  border: none;

  ${({ selected }) => selected && `
    background: #d6eaff;
  `}
`

const SwitchTitle = styled.div``

const SwitchDescription = styled.div``

interface APIExplainerProps {
  listId: string
}

enum MODE {
  REST,
  SDK,
}

const APIExplainer: React.FC<APIExplainerProps> = ({ listId }) => {
  const [mode, setMode] = useState(MODE.REST)

  return (
    <div>
      <div>Choose the best way to get data for your site</div>
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

      {mode === MODE.REST ? (
        <div>
          <div>
            <div>Request URL</div>
            <div>https://api.cryptostats.community/api/v1/{listId}</div>
          </div>

          <div>
            <div>CURL</div>
            <div>curl https://api.cryptostats.community/api/v1/{listId}</div>
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
  )
}

export default APIExplainer;
