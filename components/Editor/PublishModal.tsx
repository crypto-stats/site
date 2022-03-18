import React, { useState } from "react"
import styled from "styled-components"
import { useENSName } from "use-ens-name"
import { useWeb3React } from "@web3-react/core"
import EditorModal, { Button as ModalButton } from "./EditorModal"
import { useAdapter } from "hooks/local-adapters"
import Button from "components/Button"
import WalletConnections from "components/WalletConnections"
import Text from "components/Text"

const AlignButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

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

const VERSION_NUM_REGEX = /([\d]+)\.([\d]+)\.([\d]+)/g

enum STATE {
  INIT,
  SIGN,
  SIGNED_PUBLISH_PENDING,
  PUBLISHING,
  PUBLISHED,
}

const PublishModal: React.FC<PublishModalProps> = ({ fileName, show, onClose, editorRef }) => {
  const [state, setState] = useState(STATE.INIT)
  const [cid, setCID] = useState<null | string>(null)
  const [hash, setHash] = useState<null | string>(null)
  const { publish: publishToIPFS, adapter, getSignableHash, save } = useAdapter(fileName)
  const { account, library } = useWeb3React()
  const accountName = useENSName(account, account)

  const prepareSignature = async () => {
    setState(STATE.SIGN)
    const _hash = await getSignableHash()
    setHash(_hash)
  }

  const sign = async () => {
    setState(STATE.SIGNED_PUBLISH_PENDING)
    try {
      const signature = await library.getSigner().signMessage(hash)
      setState(STATE.PUBLISHING)

      const { codeCID } = await publishToIPFS({ signature, hash, signer: account })
      setCID(codeCID)
      setState(STATE.PUBLISHED)
    } catch (e) {
      console.warn(e)
      setState(STATE.SIGN)
    }
  }

  const lastPublication =
    adapter?.publications && adapter.publications.length > 0
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
      const startLineNumber = adapter!.code.substr(0, versionRegexResult.index).split("\n").length
      const startColumn = adapter!.code.split("\n")[startLineNumber - 1].indexOf(version) + 1
      const endColumn = startColumn + version.length

      const edit = {
        range: { endColumn, endLineNumber: startLineNumber, startColumn, startLineNumber },
        text: newVersion,
      }

      editorRef.current.executeEdits("version", [edit])
      save(adapter!.code.replace(version, newVersion), adapter!.name, newVersion)
    }
  }

  const close = () => {
    onClose()
    setState(STATE.INIT)
    setCID(null)
    setHash(null)
  }

  const returnButton = { label: "Return to Editor", onClick: close }

  let title = "Publish Your Adapter on IPFS"
  let buttons: ModalButton[] = []
  let content = null

  const disabled = state === STATE.SIGNED_PUBLISH_PENDING

  if (show) {
    switch (state) {
      case STATE.INIT:
        if (hasUpdatedVersion) {
          buttons = [returnButton, { label: "Continue", onClick: prepareSignature, disabled }]
          content = (
            <div>
              <Text tag='p' color='white' type='description'>
                Publish your adapter to IPFS to make it viewable by the community.
              </Text>
              <Text tag='p' color='white' type='description'>
                Once your adapter is published, you can share it on the CryptoStats forum to request
                verification.
              </Text>
            </div>
          )
        } else {
          buttons = [returnButton]
          content = (
            <>
              <Text tag='p' color='white' type='description'>
                This adapter has already been deployed with the current version{" "}
                <strong>{adapter!.version}</strong>.
              </Text>
              <Text tag='p' color='white' type='description' mb='24'>
                Update the version number to allow publishing to IPFS.
              </Text>
              <AlignButtons>
                <Button variant='outline' onClick={() => updateVersion!(patchVersion!)}>
                  Small update: {patchVersion}
                </Button>
                <Button variant='outline' onClick={() => updateVersion!(minorVersion!)}>
                  Medium update: {minorVersion}
                </Button>
                <Button variant='outline' onClick={() => updateVersion!(majorVersion!)}>
                  Large update: {majorVersion}
                </Button>
              </AlignButtons>
            </>
          )
        }
        break

      case STATE.SIGN:
      case STATE.SIGNED_PUBLISH_PENDING:
        buttons = [returnButton]
        if (!account) {
          content = (
            <div>
              <Text tag='p' color='white' type='description'>
                You need to connect your Web3 wallet to sign your adapter.
              </Text>
              <WalletConnections />
            </div>
          )
        } else if (!hash) {
          content = <div>Loading...</div>
        } else {
          buttons = [returnButton, { label: "Sign adapter", onClick: sign, disabled }]
          content = (
            <div>
              <Text tag='p' color='white' type='description'>
                Click "Sign Adapter" to sign your adapter code from your current account (
                {accountName}).
              </Text>
            </div>
          )
        }
        break

      case STATE.PUBLISHING:
        content = (
          <div>
            <Text tag='p' color='white' type='description'>
              Publishing to IPFS...
            </Text>
          </div>
        )
        break

      case STATE.PUBLISHED:
        title = "🎉  Adapter Successfully Published!"
        buttons = [returnButton]
        content = (
          <div>
            <Text tag='p' color='white' type='description'>
              Your adapter has been published to IPFS! You may now share the following link:
            </Text>
            <Text tag='p' type='label' mt='24' mb='16'>
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
