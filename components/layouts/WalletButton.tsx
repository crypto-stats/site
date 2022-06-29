import { useWeb3React } from '@web3-react/core'
import ConnectionButton from 'components/ConnectionButton'
import styled from 'styled-components'
import { useENSName } from 'use-ens-name'

const Root = styled(ConnectionButton)``

interface WalletButtonProps {
  className?: string
}

export const WalletButton = (props: WalletButtonProps) => {
  const { className = '' } = props
  const { account } = useWeb3React()
  const name = useENSName(account)

  return (
    <Root className={className}>{account ? name || account.substr(0, 10) : 'Connect Wallet'}</Root>
  )
}
