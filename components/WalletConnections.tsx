import React from "react"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"
import { InjectedConnector } from "@web3-react/injected-connector"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"

export const injected = new InjectedConnector({})

export const walletconnect = new WalletConnectConnector({
  qrcode: true,
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
    content: "";
    display: block;
    background: url("${({ background }) => background}");
    width: 86px;
    height: 86px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
`

export const getForceDisconnect = () => window.localStorage.getItem("force-disconnect") === "true"

export const setForceDisconnect = (val: boolean) =>
  window.localStorage.setItem("force-disconnect", val.toString())

const WalletConnections: React.FC = () => {
  const { activate } = useWeb3React()

  return (
    <ButtonRow>
      <ConnectorButton
        background='/metamask.svg'
        onClick={() => activate(injected).then(() => setForceDisconnect(false))}
      >
        Metamask
      </ConnectorButton>
      <ConnectorButton
        background='/walletconnect.svg'
        onClick={() => activate(walletconnect).then(() => setForceDisconnect(false))}
      >
        WalletConnect
      </ConnectorButton>
    </ButtonRow>
  )
}

export default WalletConnections
