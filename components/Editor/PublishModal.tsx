import React, { useState } from 'react'
// import styled from 'styled-components'
import { useENSName } from 'use-ens-name'
import { useWeb3React } from '@web3-react/core'
import ConnectionButton from 'components/ConnectionButton'
import EditorModal, { Button } from './EditorModal'
import { useAdapter } from 'hooks/local-adapters'

interface PublishModalProps {
  fileName: string
  show: boolean
  onClose: () => void
}

const PublishModal: React.FC<PublishModalProps> = ({ fileName, show, onClose }) => {
  const [state, setState] = useState('init')
  const [cid, setCID] = useState<null | string>(null)
  const [hash, setHash] = useState<null | string>(null)
  const { publish: publishToIPFS, adapter, getSignableHash } = useAdapter(fileName)
  const { account, library } = useWeb3React()
  const accountName = useENSName(account, account)

  const prepareSignature = async () => {
    setState('sign')
    const _hash = await getSignableHash()
    setHash(_hash)
  }

  const sign = async () => {
    setState('signed-publish-pending')
    try {
      const signature = await library.getSigner().signMessage(hash)

      const { codeCID } = await publishToIPFS({ signature, hash, signer: account })
      setCID(codeCID)
      setState('published')
    } catch (e) {
      console.warn(e)
      setState('sign')
    }
  }

  const lastPublication = adapter?.publications && adapter.publications.length > 0
    ? adapter!.publications[adapter!.publications.length - 1]
    : null
  const hasUpdatedVersion = !lastPublication || adapter?.version !== lastPublication.version

  const close = () => {
    onClose()
    setState('init')
    setCID(null)
    setHash(null)
  }

  const returnButton = { label: 'Return to Editor', onClick: close }

  let title = 'Publish Your Adapter on IPFS'
  let buttons: Button[] = []
  let content = null

  const disabled = state === 'signed-publish-pending'

  if (show) {
    switch (state) {
      case 'init':
        if (hasUpdatedVersion) {
          buttons = [
            returnButton,
            { label: 'Continue', onClick: prepareSignature, disabled },
        ]
          content = (
            <div>
              <p>Publish your adapter to IPFS to make it viewable by the community.</p>
              <p>Once your adapter is published, you can share it on the CryptoStats forum to request verification.</p>
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

      case 'sign':
      case 'signed-publish-pending':
        buttons = [returnButton]
        if (!account) {
          content = (
            <div>
              <div>You need to connect your Web3 wallet to sign your adapter.</div>
              <ConnectionButton>Connect Wallet</ConnectionButton>
            </div>
          )
        } else if (!hash) {
          content = <div>Loading...</div>
        } else {
          buttons = [
            returnButton,
            { label: 'Sign adapter', onClick: sign, disabled },
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
            <p>https://cryptostats.community/discover/adapter/{cid}</p>
          </div>
        )
        break
    }
  }

  return (
    <EditorModal
      isOpen={show}
      onClose={close}
      title={title}
      buttons={buttons}
    >
      {content}
    </EditorModal>
  )
}

export default PublishModal
