import React, { useRef, useState } from 'react'
import styled from 'styled-components'

import EditorModal, { Button as ModalButton } from '../EditorModal'
import { DEFAULT_PUBLISH_CONFIG, useLocalSubgraph } from 'hooks/local-subgraphs'

import { ProgressBar } from '../atoms'
import { InitStage } from './InitStage'
import { DeployStatus, useSubgraphDeployment } from 'hooks/useSubgraphDeployment'
import { useWeb3React } from '@web3-react/core'
import { injected, walletconnect } from 'components/WalletConnections'

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
  const { activate, account } = useWeb3React()
  const { subgraph, setPublishConfig } = useLocalSubgraph(fileName)
  const {
    status,
    prepareFiles,
    signSubgraph,
    deploy: deployToNode,
    reset,
    error,
  } = useSubgraphDeployment(subgraph)
  const [publishState, setPublishState] = useState(
    subgraph?.publishConfig || DEFAULT_PUBLISH_CONFIG
  )
  const saveConfig = useRef(!!subgraph?.publishConfig)

  const signAndDeploy = async () => {
    await signSubgraph()
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
        buttons = account
          ? [
              returnButton,
              {
                label: 'Sign & Deploy',
                onClick: signAndDeploy,
                disabled: status === DeployStatus.SIGNATURE_PENDING,
              },
            ]
          : [
              returnButton,
              {
                label: 'Connect Metamask',
                onClick: () => activate(injected),
              },
              {
                label: 'Connect WalletConnect',
                onClick: () => activate(walletconnect),
              },
            ]
        content = <div>Sign the subgraph with your Ethereum wallet to deploy</div>
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
        const deployURL =
          publishState.node === 'hosted'
            ? `https://thegraph.com/hosted-service/subgraph/${publishState.name}?version=pending`
            : `https://thegraph.com/studio/subgraph/${publishState.name}/`
        buttons = [closeButton, { label: 'Go to Subgraph', href: deployURL }]
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

        buttons = [
          {
            label: 'Retry',
            onClick: reset,
          },
          closeButton,
        ]
        content = (
          <ProgressContainer>
            <span className="info-p" style={{ marginTop: 24 }}>
              Error: {error}
            </span>
          </ProgressContainer>
        )
        break
    }
  }

  return (
    <EditorModal isOpen={show} title={title} buttons={buttons} width={'550px'}>
      <Root>{content}</Root>
    </EditorModal>
  )
}
