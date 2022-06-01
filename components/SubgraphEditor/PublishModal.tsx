import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Info } from 'lucide-react'
import ReactTooltip from 'react-tooltip'

import EditorModal, { Button as ModalButton } from './EditorModal'
import IconElement from 'components/Icon'
import { STATUS, useLocalSubgraph } from 'hooks/local-subgraphs'

import { InputLabel, InputField, ExplanationText, ProgressBar } from './atoms'

const subgraphName = 'dmihal/test-graph'

const Root = styled.div`
  .info-p {
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .access-token-url {
    color: #355eff;
    text-decoration: none;
    font-weight: bold;
  }

  .input-label-div {
    width: 100%;
    display: inline-flex;
    justify-content: space-between;
  }
`

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

const ProgressContainer = styled.div`
  margin-top: var(--spaces-5);

  > .status-text {
    color: var(--color-white);
  }

  > .progress-bar-container {
    margin-top: 14px;
    display: flex;
    justify-content: space-between;
    gap: 24px;
  }
`

interface PublishModalProps {
  fileName: string
  show: boolean
  onClose: () => void
  editorRef: any
}

enum STATE {
  INIT,
  COMPILING,
  UPLOADING,
  DEPLOYING,
  PUBLISHED,
}

const PublishModal: React.FC<PublishModalProps> = ({ fileName, show, onClose }) => {
  const [state, setState] = useState(STATE.PUBLISHED)
  const [dummyTimer, setDummyTimer] = useState(0)
  const { deploy: deployToNode, deployStatus } = useLocalSubgraph(fileName)

  const prepareDeployment = async () => {
    setState(STATE.COMPILING)
  }

  const deploy = async () => {
    try {
      setState(STATE.COMPILING)

      await deployToNode(subgraphName, process.env.NEXT_PUBLIC_GRAPH_KEY!)
      // setState(STATE.DEPLOYED)
    } catch (e) {
      console.warn(e)
      // setState(STATE.DEPLOY_PENDING)
    }
  }

  const close = () => {
    onClose()
    setState(STATE.INIT)
  }

  useEffect(() => {
    if (deployStatus?.status === STATUS.COMPLETE) {
      // setState(STATE.DEPLOYED)
    }
  }, [deployStatus])

  useEffect(() => {
    setInterval(() => setDummyTimer(prev => prev + 5), 5000)
  }, [])

  useEffect(() => {
    if (dummyTimer === 15) {
      setState(STATE.UPLOADING)
    }
    if (dummyTimer === 20) {
      setState(STATE.DEPLOYING)
    }

    if (dummyTimer === 25) {
      setState(STATE.PUBLISHED)
    }
  }, [dummyTimer])

  const returnButton = { label: 'Cancel', onClick: close }
  const closeButton = { label: 'Close', onClick: close }

  let title = 'Depoly configuration'
  let buttons: ModalButton[] = []
  let content = null

  if (show) {
    switch (state) {
      case STATE.INIT:
        buttons = [returnButton, { label: 'Deploy', onClick: prepareDeployment }]
        content = (
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
            <InputField onChange={() => {}} name="" value="" />

            <div style={{ marginBottom: 32 }} />
            <InputLabel>
              <div className="input-label-div">
                <span>Access token</span>
                <a className="access-token-url" href="#">
                  Get it here
                </a>
              </div>
            </InputLabel>
            <InputField onChange={() => {}} name="" value="" />
          </ConfigContainer>
        )
        break

      case STATE.COMPILING:
        title = 'Publishing'
        content = (
          <ProgressContainer>
            <span className="status-text">Step 1/3: Compiling</span>
            <div className="progress-bar-container">
              <ProgressBar active />
              <ProgressBar />
              <ProgressBar />
            </div>
          </ProgressContainer>
        )
        break

      case STATE.UPLOADING:
        title = 'Publishing'
        content = (
          <ProgressContainer>
            <span className="status-text">Step 2/3: Uploading</span>
            <div className="progress-bar-container">
              <ProgressBar completed />
              <ProgressBar active />
              <ProgressBar />
            </div>
          </ProgressContainer>
        )
        break

      case STATE.DEPLOYING:
        title = 'Publishing'
        content = (
          <ProgressContainer>
            <span className="status-text">Step 3/3: Deploying</span>
            <div className="progress-bar-container">
              <ProgressBar completed />
              <ProgressBar completed />
              <ProgressBar active />
            </div>
          </ProgressContainer>
        )
        break

      case STATE.PUBLISHED:
        title = 'Published'
        buttons = [closeButton, { label: 'Go to Subgraph', onClick: prepareDeployment }]
        content = (
          <ProgressContainer>
            <span className="status-text">Step 3/3: Subgraph published</span>
            <div className="progress-bar-container">
              <ProgressBar completed />
              <ProgressBar completed />
              <ProgressBar completed />
            </div>
            <span className="info-p" style={{ marginTop: 24 }}>
              [More info about the just published subgraph]
            </span>
          </ProgressContainer>
        )
        break
    }
  }

  return (
    <EditorModal isOpen={show} title={title} buttons={buttons} width={'550px'}>
      <Root>
        <div className="info-p">
          <Info size={16} />
          Informative copy
        </div>
        {content}
      </Root>
    </EditorModal>
  )
}

export default PublishModal
