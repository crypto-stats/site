import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'

import { InputLabel, InputField, ExplanationText } from '../atoms'
import IconElement from 'components/Icon'
import { PublishState } from './PublishModal'

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
  border: 0;
  outline: 0;

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
  setPublishState: React.Dispatch<React.SetStateAction<PublishState>>
  publishState: PublishState
}

export const InitStage = (props: InitStageProps) => {
  const { publishState, setPublishState } = props

  const handleInputChange = (e: any) => {
    console.log(e)
    setPublishState(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <ConfigContainer>
      <div style={{ marginBottom: 32 }} />
      <InputLabel>Destination</InputLabel>
      <div className="network-selection-container">
        <NetworkButton className="ready-now">
          <IconElement type="ethereum" size={'x-small'} />
          Hosted
        </NetworkButton>
        <NetworkButton disabled>
          <IconElement type="ethereum" size={'x-small'} />
          Mainnet
          <span className="ready-soon">Ready Soon</span>
        </NetworkButton>
      </div>
      <div style={{ marginBottom: 32 }} />

      <InputLabel>
        <div className="input-label-div">
          Subgraph slug
          <ExplanationText question="What is this?" answer="hello world" />
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
          <span>Access token</span>
          <a className="access-token-url" href="#">
            Get it here
          </a>
        </div>
      </InputLabel>
      <InputField
        onChange={handleInputChange}
        overrideOnChange
        name="accessToken"
        value={publishState.accessToken}
      />
    </ConfigContainer>
  )
}
