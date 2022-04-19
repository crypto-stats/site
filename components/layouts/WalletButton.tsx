import { useWeb3React } from '@web3-react/core'
import ConnectionButton from 'components/ConnectionButton'
import styled from 'styled-components'
import { useENSName } from 'use-ens-name'

const Root = styled(ConnectionButton)`
  height: 35px;
  border-radius: 5px;
  border: solid 1px #7b7b7b;
  background-color: #535353;
  padding: 0 10px;
  color: #eeeeee;
  margin-right: 10px;
  cursor: pointer;

  &:hover {
    background-color: #404040;
  }
`

export const WalletButton = () => {
  const { account } = useWeb3React()
  const name = useENSName(account)

  return <Root>{account ? name || account.substr(0, 10) : 'Connect Wallet'}</Root>
}
