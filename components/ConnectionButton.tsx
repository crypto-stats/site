import React, { useState, useEffect, Fragment } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import Modal from './Modal'

import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'


export const injected = new InjectedConnector({ })

export const walletconnect = new WalletConnectConnector({
  qrcode: true
})

const ButtonElement = styled.button`
`

interface ConnectionButtonProps {
  className?: string;
}

const ConnectionButton: React.FC<ConnectionButtonProps> = ({ children, className }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const { active, account, deactivate, activate } = useWeb3React()

  useEffect(() => {
    if (!active) {
      injected.isAuthorized().then((isAuthorized) => {
        if (isAuthorized) {
          activate(injected, undefined, true)
        }
      })
    }
  }, [activate, active])

  return (
    <Fragment>
      <ButtonElement className={className} onClick={() => setModalOpen(true)}>
        {children}
      </ButtonElement>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Connect Wallet"
        buttons={[{ label: 'Cancel', onClick: () => setModalOpen(false) }]}
      >
        {account ? (
          <div>
            <div>Connected to {account}</div>
            <div>
              <button onClick={deactivate}>Disconnect</button>
            </div>
          </div>
        ) : (
          <div>
            <button onClick={() => activate(injected)}>Metamask/browser wallet</button>
            <button onClick={() => activate(walletconnect)}>WalletConnect</button>
          </div>
        )}
      </Modal>
    </Fragment>
  )
}

export default ConnectionButton;
