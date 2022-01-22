import React, { useState } from 'react'
// import styled from 'styled-components'
import { useENSName } from 'use-ens-name'
import { useWeb3React } from '@web3-react/core'
import EditorModal, { Button as ModalButton } from './EditorModal'
import { useAdapter } from 'hooks/local-adapters'
import Button from 'components/Button'
import WalletConnections from 'components/WalletConnections'

interface PublishModalProps {
  fileName: string
  show: boolean
  onClose: () => void
  editorRef: any
}

const VERSION_NUM_REGEX = /([\d]+)\.([\d]+)\.([\d]+)/g

const PublishModal: React.FC<PublishModalProps> = ({ fileName, show, onClose, editorRef }) => {
  const [state, setState] = useState('init')
  const [cid, setCID] = useState<null | string>(null)
  const [hash, setHash] = useState<null | string>(null)
  const { publish: publishToIPFS, adapter, getSignableHash, save } = useAdapter(fileName)
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

  let patchVersion: string | null = null
  let minorVersion: string | null = null
  let majorVersion: string | null = null
  let updateVersion: ((newVersion: string) => void) | null = null
  const versionRegexResult = show && !hasUpdatedVersion && VERSION_NUM_REGEX.exec(adapter!.code)
  if (versionRegexResult) {
    const [version, major, minor, patch] = versionRegexResult

    patchVersion = `${major}.${minor}.${parseInt(patch) + 1}`
    minorVersion = `${major}.${parseInt(minor) + 1}.0`
    majorVersion = `${parseInt(major) + 1}.0.0`

    updateVersion = (newVersion: string) => {
      const startLineNumber = adapter!.code.substr(0, versionRegexResult.index).split('\n').length
      const startColumn = adapter!.code.split('\n')[startLineNumber - 1].indexOf(version) + 1
      const endColumn = startColumn + version.length

      const edit = {
        range: { endColumn, endLineNumber: startLineNumber, startColumn, startLineNumber },
        text: newVersion,
      }

      editorRef.current.executeEdits('version', [edit])
      save(adapter!.code.replace(version, newVersion), adapter!.name, newVersion)
    }
  }

  const close = () => {
    onClose()
    setState('init')
    setCID(null)
    setHash(null)
  }

  const returnButton = { label: 'Return to Editor', onClick: close }

  let title = 'Publish Your Adapter on IPFS'
  let buttons: ModalButton[] = []
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
              <div>
                <Button onClick={() => updateVersion!(patchVersion!)}>Small update: {patchVersion}</Button>
              </div>
              <div>
                <Button onClick={() => updateVersion!(minorVersion!)}>Medium update: {minorVersion}</Button>
              </div>
              <div>
                <Button onClick={() => updateVersion!(majorVersion!)}>Large update: {majorVersion}</Button>
              </div>
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

              <WalletConnections />
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
