import React, { useState } from 'react'
// import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useENSName } from 'hooks/ens'
import ConnectionButton from 'components/ConnectionButton'
import Modal, { Button } from 'components/Modal'
import { useAdapter } from 'hooks/local-adapters'

interface PublishModalProps {
  fileName: string
  show: boolean
  onClose: () => void
}

const PublishModal: React.FC<PublishModalProps> = ({ fileName, show, onClose }) => {
  const [state, setState] = useState('init')
  const [cid, setCID] = useState<null | string>(null)
  const [signatureData, setSignatureData] = useState<null | string>(null)
  const { publish: publishToIPFS, adapter, prepare } = useAdapter(fileName)
  const { account, library } = useWeb3React()
  const accountName = useENSName(account, account)

  const simplePublish = async () => {
    setState('simple-publish-pending')
    try {
      if (!adapter) {
        throw new Error('Adapter not set')
      }
      if (!adapter.name) {
        throw new Error('Name not set')
      }
      if (!adapter.version) {
        throw new Error('Version not set')
      }

      const { codeCID } = await publishToIPFS()
      setCID(codeCID)
    } catch (e) {
      console.warn(e)
    }
    setState('published')
  }
  const prepareSignature = async () => {
    setState('sign')
    const sigData = await prepare()
    setSignatureData(sigData)
  }

  const sign = async () => {
    const signature = await library.getSigner().signMessage(signatureData)

    const { codeCID } = await publishToIPFS({ signature })
    setCID(codeCID)
    setState('published')
  }

  const lastPublication = adapter?.publications && adapter.publications.length > 0
    ? adapter!.publications[adapter!.publications.length - 1]
    : null
  const hasUpdatedVersion = !lastPublication || adapter?.version !== lastPublication.version

  const close = () => {
    onClose()
    setState('init')
    setCID(null)
  }

  const returnButton = { label: 'Return to Editor', onClick: close }

  let title = 'Publish Your Adapter on IPFS'
  let buttons: Button[] = []
  let content = null

  const disabled = state === 'simple-publish-pending' || state === 'signed-publish-pending'

  if (show) {
    switch (state) {
      case 'init':
        if (hasUpdatedVersion) {
          buttons = [
            returnButton,
            { label: 'Continue', onClick: () => setState('signature-prompt') },
          ]
          content = (
            <div>
              <p>Publish your adapter to IPFS to make it viewable by the community.</p>
              <p>Once your adapter is published, you may post it on the CryptoStats forum to request inclusion.</p>
            </div>
          )
        } else {
          buttons = [returnButton]
          content = (
            <div>
              <p>This adapter has already been deployed with the current version ({adapter!.version}).</p>
              <p>Update the version number to allow publishing to IPFS.</p>
            </div>
          )
        }
        break

      case 'signature-prompt':
      case 'simple-publish-pending':
        buttons = [
          returnButton,
          { label: 'Skip signing and publish', onClick: simplePublish, disabled },
          { label: 'Sign my adapter', onClick: prepareSignature, disabled },
        ]
        content = (
          <div>
            <p>Publish your adapter to IPFS to make it viewable by the community.</p>
            <p>Once your adapter is published, you may post it on the CryptoStats forum to request inclusion.</p>
          </div>
        )
        break

      case 'sign':
        buttons = [returnButton]
        if (!account) {
          content = (
            <div>
              <ConnectionButton>Connect Wallet</ConnectionButton>
            </div>
          )
        } else if (!signatureData) {
          content = <div>Loading...</div>
        } else {
          buttons = [
            returnButton,
            { label: 'Sign adapter', onClick: sign },
          ]
          content = (
            <div>
              <p>Click "Sign Adapter" to sign your adapter code from your current account ({accountName}).</p>
            </div>
          )
        }
        break

      case 'published':
        title = 'Adapter Successfully Published!'
        buttons = [returnButton]
        content = (
          <div>
            <p>Your adapter has been published to IPFS! You may now share the following link:</p>
            <p>https://cryptostats.community/module/{cid}</p>
          </div>
        )
        break
    }
  }

  return (
    <Modal
      isOpen={show}
      onClose={close}
      title={title}
      buttons={buttons}
    >
      {content}
    </Modal>
  )
}

export default PublishModal
