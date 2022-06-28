import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { Info } from 'lucide-react'

import EditorModal, { Button as ModalButton } from '../EditorModal'
import { DEFAULT_PUBLISH_CONFIG, useLocalSubgraph } from 'hooks/local-subgraphs'

import { ProgressBar } from '../atoms'
import { InitStage } from './InitStage'
import { DeployStatus, useSubgraphDeployment } from 'hooks/useSubgraphDeployment'

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

export const PublishModal: React.FC<PublishModalProps> = props => {
  const { fileName, show, onClose } = props
  const { subgraph, setPublishConfig } = useLocalSubgraph(fileName)
  const {
    status,
    prepareFiles,
    signSubgraph,
    deploy: deployToNode,
  } = useSubgraphDeployment(subgraph)
  const [publishState, setPublishState] = useState(
    subgraph?.publishConfig || DEFAULT_PUBLISH_CONFIG
  )
  const saveConfig = useRef(!!subgraph?.publishConfig)

  const deploy = async () => {
    setPublishConfig(saveConfig.current ? publishState : null)
    await deployToNode(publishState)
  }

  const returnButton = { label: 'Cancel', onClick: onClose }
  const closeButton = { label: 'Close', onClick: onClose }

  let title = 'Deploy configuration'
  let buttons: ModalButton[] = []
  let content = null

  if (show) {
    switch (status) {
      case DeployStatus.READY_TO_PREPARE:
      case DeployStatus.PREPARING:
      case undefined:
        buttons = [
          returnButton,
          {
            label: 'Next',
            onClick: prepareFiles,
            disabled:
              !publishState.accessToken || !publishState.name || status === DeployStatus.PREPARING,
          },
        ]
        content = (
          <InitStage
            setPublishState={setPublishState}
            publishState={publishState}
            saveConfigRef={saveConfig}
          />
        )
        break

      case DeployStatus.READY_TO_SIGN:
      case DeployStatus.SIGNATURE_PENDING:
        buttons = [
          returnButton,
          {
            label: 'Sign',
            onClick: signSubgraph,
            disabled: status === DeployStatus.SIGNATURE_PENDING,
          },
        ]
        content = <div>Sign the subgraph with your Ethereum wallet</div>
        break

      case DeployStatus.READY_TO_SIGN:
      case DeployStatus.SIGNATURE_PENDING:
        buttons = [
          returnButton,
          {
            label: 'Sign',
            onClick: signSubgraph,
            disabled: status === DeployStatus.SIGNATURE_PENDING,
          },
        ]
        content = <div>Sign the subgraph with your Ethereum wallet</div>
        break

      case DeployStatus.READY_TO_DEPLOY:
        buttons = [
          returnButton,
          {
            label: 'Deploy',
            onClick: deploy,
          },
        ]
        content = <div>All set! Click "Deploy" to deploy your subgraph to {publishState.name}</div>
        break

      case DeployStatus.DEPLOYING:
        title = 'Deploying'
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

      case DeployStatus.DEPLOY_COMPLETE:
        title = 'Published'
        // TODO
        buttons = [closeButton, { label: 'Go to Subgraph', href: 'deployStatus.url!' }]
        content = (
          <ProgressContainer>
            <span className="status-text">Step 3/3: Subgraph published</span>
            <div className="progress-bar-container">
              <ProgressBar completed />
              <ProgressBar completed />
              <ProgressBar completed />
            </div>
            <span className="info-p" style={{ marginTop: 24 }}>
              Vist the subgraph page on the Graph Explorer to view the indexing status and send
              queries.
            </span>
          </ProgressContainer>
        )
        break

      case DeployStatus.ERROR:
        title = 'Error'

        buttons = [closeButton]
        content = (
          <ProgressContainer>
            <span className="info-p" style={{ marginTop: 24 }}>
              Error
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
