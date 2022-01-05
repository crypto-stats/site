import React, { useState, useEffect, Fragment } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import EditorModal from './Editor/EditorModal'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import Button from 'components/Button'
export const injected = new InjectedConnector({ })

export const walletconnect = new WalletConnectConnector({
  qrcode: true
})


const ButtonRow = styled.div`
  display: flex;
`

const ConnectorButton = styled.button<{ background: string }>`
  border: solid 1px #4b4b4b;
  border-radius: 4px;
  height: 120px;
  width: 260px;
  display: flex;
  background: transparent;
  align-items: center;
  justify-content: space-around;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 20px;
  cursor: pointer;

  &:hover {
    background: #222222;
  }

  &:before {
    content: '';
    display: block;
    background: url('${({ background }) => background}');
    width: 86px;
    height: 86px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
`

const getForceDisconnect = () => window.localStorage.getItem('force-disconnect') === 'true'

const setForceDisconnect = (val: boolean) => window.localStorage.setItem('force-disconnect', val.toString())

interface ConnectionButtonProps {
  
}

const ConnectionButton: React.FC<ConnectionButtonProps> = ({ children }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const { active, account, deactivate, activate } = useWeb3React()

  useEffect(() => {
    if (!active && !getForceDisconnect()) {
      injected.isAuthorized().then((isAuthorized) => {
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
      <Button variant="outline" onClick={() => setModalOpen(true)} >
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
          <ButtonRow>
            <ConnectorButton
              background="/metamask.svg"
              onClick={() => activate(injected).then(() => setForceDisconnect(false))}
            >
              Metamask
            </ConnectorButton>
            <ConnectorButton
              background="/walletconnect.svg"
              onClick={() => activate(walletconnect).then(() => setForceDisconnect(false))}
            >
              WalletConnect
            </ConnectorButton>
          </ButtonRow>
        )}
      </EditorModal>
    </Fragment>
  )
}

export default ConnectionButton;
