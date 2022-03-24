import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import EditorModal, { Button as ModalButton } from './EditorModal'
import Text from 'components/Text'
import { compileAs } from 'utils/as-compiler'
import { publishSubgraph } from 'utils/publish-subgraph'
import { DEFAULT_MAPPING, useLocalSubgraph } from 'hooks/useLocalSubgraph'

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
}

enum STATE {
  COMPILING,
  INIT,
  SIGN,
  SIGNED_PUBLISH_PENDING,
  PUBLISHING,
  PUBLISHED,
}

const PublishSubgraphModal: React.FC<PublishModalProps> = ({ fileName, onClose, show }) => {
  const [state, setState] = useState(STATE.INIT)
  const [cid, setCID] = useState<null | string>(null)
  const { subgraph, generateManifest } = useLocalSubgraph(fileName)

  const close = () => {
    onClose()
    setState(STATE.INIT)
    setCID(null)
  }

  useEffect(() => {
    if (show && subgraph?.schema) {
      setState(STATE.COMPILING)
      generateManifest().then(manifest => console.log(manifest))

      if (subgraph.mappings[DEFAULT_MAPPING]) {
        compileAs(subgraph.mappings[DEFAULT_MAPPING]).then(output => {
          console.log({ output })
          setState(STATE.SIGNED_PUBLISH_PENDING)
        })
      }
    }
  }, [subgraph?.schema, show])

  const returnButton = { label: 'Return to Editor', onClick: close }

  let title = 'Publish Your Adapter on IPFS'
  let buttons: ModalButton[] = []
  let content = null

  if (show) {
    switch (state) {
      case STATE.COMPILING:
        title = 'Compiling'
        buttons = [returnButton]
        content = <div>Compiling</div>
        break

      case STATE.SIGNED_PUBLISH_PENDING:
        const publishButton = {
          label: 'Publish',
          onClick: async () => {
            setState(STATE.PUBLISHING)
            await publishSubgraph()
            setState(STATE.PUBLISHED)
          },
        }
        title = 'Publish pending'
        buttons = [returnButton, publishButton]
        break

      case STATE.PUBLISHED:
        title = '🎉  Adapter Successfully Published!'
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

export default PublishSubgraphModal
