import React, { useState } from 'react'
import styled from 'styled-components'
import EditorModal, { Button as ModalButton } from './EditorModal'
import Text from 'components/Text'
import { useLocalSubgraph } from 'hooks/local-subgraphs'

const subgraphName = 'dmihal/test-graph'

const ShareUrl = styled.div`
  padding: 16px;
  max-width: 100%;
  overflow: hidden;
  background-color: #222222;
  border: 1px solid #444444;
  border-radius: 4px;
`

interface PublishModalProps {
  fileName: string
  show: boolean
  onClose: () => void
  editorRef: any
}

enum STATE {
  INIT,
  DEPLOY_PENDING,
  DEPLOYING,
  DEPLOYED,
}

const PublishModal: React.FC<PublishModalProps> = ({ fileName, show, onClose }) => {
  const [state, setState] = useState(STATE.INIT)
  const [cid, setCID] = useState<null | string>(null)
  const { deploy: deployToNode } = useLocalSubgraph(fileName)

  const prepareDeployment = async () => {
    setState(STATE.DEPLOY_PENDING)
  }

  const deploy = async () => {
    try {
      setState(STATE.DEPLOYING)

      await deployToNode(subgraphName, process.env.NEXT_PUBLIC_GRAPH_KEY!)
      setState(STATE.DEPLOYED)
    } catch (e) {
      console.warn(e)
      setState(STATE.DEPLOY_PENDING)
    }
  }

  const close = () => {
    onClose()
    setState(STATE.INIT)
    setCID(null)
  }

  const returnButton = { label: 'Return to Editor', onClick: close }

  let title = 'Publish Your Adapter on IPFS'
  let buttons: ModalButton[] = []
  let content = null

  if (show) {
    switch (state) {
      case STATE.INIT:
        buttons = [returnButton, { label: 'Continue', onClick: prepareDeployment }]
        content = (
          <div>
            <Text tag="p" color="white" type="description">
              Publish your adapter to IPFS to make it viewable by the community.
            </Text>
            <Text tag="p" color="white" type="description">
              Once your adapter is published, you can share it on the CryptoStats forum to request
              verification.
            </Text>
          </div>
        )
        break

      case STATE.DEPLOY_PENDING:
        buttons = [returnButton, { label: 'Sign adapter', onClick: deploy }]
        content = (
          <div>
            <Text tag="p" color="white" type="description">
              Click "Publish" to deploy your subgraph.
            </Text>
          </div>
        )
        break

      case STATE.DEPLOYING:
        content = (
          <div>
            <Text tag="p" color="white" type="description">
              Deploying...
            </Text>
          </div>
        )
        break

      case STATE.DEPLOYED:
        title = '🎉  Subgraph Successfully Deployed!'
        buttons = [returnButton]
        content = (
          <div>
            <Text tag="p" color="white" type="description">
              Your adapter has been published to IPFS! You may now share the following link:
            </Text>
            <Text tag="p" type="label" mt="24" mb="16">
              Adapter url
            </Text>
            <ShareUrl>https://cryptostats.community/discover/adapter/{cid}</ShareUrl>
          </div>
        )
        break
    }
  }

  return (
    <EditorModal isOpen={show} onClose={close} title={title} buttons={buttons}>
      {content}
    </EditorModal>
  )
}

export default PublishModal
