import React, { useState, useEffect, Fragment } from 'react'
import { useWeb3React } from '@web3-react/core'
import EditorModal from './Editor/EditorModal'
import Button from 'components/Button'
import WalletConnections, {
  getForceDisconnect,
  injected,
  setForceDisconnect,
} from './WalletConnections'

interface ConnectionButtonProps {
  children: React.ReactNode
  className?: string
}

const ConnectionButton = (props: ConnectionButtonProps) => {
  const { children, className } = props

  const [modalOpen, setModalOpen] = useState(false)
  const { active, account, deactivate, activate } = useWeb3React()

  useEffect(() => {
    if (!active && !getForceDisconnect()) {
      injected.isAuthorized().then(isAuthorized => {
        if (isAuthorized) {
          activate(injected, undefined, true)
        }
      })
    }
  }, [activate, active])

  const disconnect = () => {
    setForceDisconnect(true)
    deactivate()
  }

  return (
    <Fragment>
      <Button className={className} variant="outline" onClick={() => setModalOpen(true)}>
        {children}
      </Button>

      <EditorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Connect Wallet"
        buttons={[{ label: 'Close', onClick: () => setModalOpen(false) }]}
      >
        {account ? (
          <div>
            <div>Connected to {account}</div>
            <div>
              <button onClick={disconnect}>Disconnect</button>
            </div>
          </div>
        ) : (
          <WalletConnections />
        )}
      </EditorModal>
    </Fragment>
  )
}

export default ConnectionButton
