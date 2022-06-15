import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { Info } from 'lucide-react'

import EditorModal, { Button as ModalButton } from '../EditorModal'
import { DEFAULT_PUBLISH_CONFIG, STATUS, useLocalSubgraph } from 'hooks/local-subgraphs'

import { ProgressBar } from '../atoms'
import { InitStage } from './InitStage'

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
  const {
    subgraph,
    deploy: deployToNode,
    deployStatus,
    resetDeployStatus,
    setPublishConfig,
  } = useLocalSubgraph(fileName)
  const [publishState, setPublishState] = useState(
    subgraph?.publishConfig || DEFAULT_PUBLISH_CONFIG
  )
  const saveConfig = useRef(!!subgraph?.publishConfig)

  const deploy = async () => {
    setPublishConfig(saveConfig.current ? publishState : null)
    const node =
      publishState.node === 'hosted'
        ? '/api/graph/deploy'
        : 'https://api.studio.thegraph.com/deploy/'
    await deployToNode(node, publishState.name, publishState.accessToken)
  }

  const close = () => {
    resetDeployStatus()
    onClose()
  }

  const returnButton = { label: 'Cancel', onClick: onClose }
  const closeButton = { label: 'Close', onClick: close }

  let title = 'Deploy configuration'
  let buttons: ModalButton[] = []
  let content = null

  if (show) {
    switch (deployStatus?.status) {
      case STATUS.INITIALIZING:
      case undefined:
        buttons = [
          returnButton,
          {
            label: 'Deploy',
            onClick: deploy,
            disabled: !publishState.accessToken || !publishState.name,
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

      case STATUS.COMPILING:
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

      case STATUS.IPFS_UPLOAD:
        title = 'Publishing'
        content = (
          <ProgressContainer>
            <span className="status-text">Step 2/3: Uploading {deployStatus?.file || null}</span>
            <div className="progress-bar-container">
              <ProgressBar completed />
              <ProgressBar active />
              <ProgressBar />
            </div>
          </ProgressContainer>
        )
        break

      case STATUS.DEPLOYING:
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

      case STATUS.COMPLETE:
        title = 'Published'
        // TODO
        buttons = [closeButton, { label: 'Go to Subgraph', href: deployStatus.url! }]
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

      case STATUS.ERROR:
        title = 'Error'

        buttons = [closeButton]
        content = (
          <ProgressContainer>
            <span className="info-p" style={{ marginTop: 24 }}>
              {deployStatus.errorMessage}
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
