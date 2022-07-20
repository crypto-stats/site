import { ChangeEvent, useState } from 'react'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'

import { InputLabel, InputField, ExplanationText } from '../atoms'
import IconElement from 'components/Icon'
import { PublishConfig } from 'hooks/useSubgraphDeployment'

const ConfigContainer = styled.div`
  display: flex;
  flex-direction: column;

  > .network-selection-container {
    display: flex;
    justify-content: space-between;
    margin-top: var(--spaces-1);
  }
`

const NetworkButton = styled.button`
  background-color: #46464d;
  color: var(--color-white);
  display: inline-flex;
  gap: 8px;
  width: 48%;
  align-items: center;
  height: 38px;
  padding: 8px 10px;
  border: solid 3px transparent;
  outline: 0;
  cursor: pointer;

  &:hover {
    background: #36363d;
  }

  &:disabled {
    color: #a3a0a0;
  }

  &.ready-now {
    border: 3px solid var(--color-primary);
    border-radius: 4px;
  }

  > .ready-soon {
    color: #606060;
    font-size: 9px;
    text-transform: uppercase;
    align-self: baseline;
  }
`

interface InitStageProps {
  setPublishState: React.Dispatch<React.SetStateAction<PublishConfig>>
  publishState: PublishConfig
  saveConfigRef: React.MutableRefObject<boolean>
}

export const InitStage = (props: InitStageProps) => {
  const { publishState, setPublishState, saveConfigRef } = props
  const [saveConfig, setSaveConfig] = useState(saveConfigRef.current)

  const handleSaveChecked = (e: ChangeEvent<HTMLInputElement>) => {
    saveConfigRef.current = e.target.checked
    setSaveConfig(e.target.checked)
  }

  const handleInputChange = (e: any) =>
    setPublishState(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const setNode = (nodeName: typeof publishState.node) => () =>
    setPublishState(prev => ({ ...prev, node: nodeName }))

  return (
    <ConfigContainer>
      <div style={{ marginBottom: 32 }} />
      <InputLabel>Destination</InputLabel>
      <div className="network-selection-container">
        <NetworkButton
          className={publishState.node === 'hosted' ? 'ready-now' : ''}
          onClick={setNode('hosted')}>
          <IconElement type="ethereum" size={'x-small'} />
          Graph Mainnet
        </NetworkButton>
        <NetworkButton
          className={publishState.node === 'studio' ? 'ready-now' : ''}
          onClick={setNode('studio')}>
          <IconElement type="ethereum" size={'x-small'} />
          Subgraph Studio
        </NetworkButton>
      </div>
      <div style={{ marginBottom: 32 }} />

      <InputLabel>
        <div className="input-label-div">
          Subgraph slug
          <ExplanationText
            question="What is this?"
            answer="Visit the Subgraph Studio on thegraph.com for your subgraph slug & deploy key"
          />
          <ReactTooltip />
        </div>
      </InputLabel>
      <InputField
        onChange={handleInputChange}
        overrideOnChange
        name="name"
        value={publishState.name}
      />

      <div style={{ marginBottom: 32 }} />
      <InputLabel>
        <div className="input-label-div">
          <span>Deploy Key</span>
        </div>
      </InputLabel>
      <InputField
        onChange={handleInputChange}
        overrideOnChange
        name="accessToken"
        value={publishState.accessToken}
      />

      <div style={{ marginBottom: 32 }} />
      <InputLabel>
        <label style={{ display: 'flex' }}>
          <input type="checkbox" checked={saveConfig} onChange={handleSaveChecked} />
          <div className="input-label-div">Save deploy configuration</div>
        </label>
      </InputLabel>
    </ConfigContainer>
  )
}
