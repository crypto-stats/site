import React from 'react'
import styled from 'styled-components'

const IcoRound = styled.div<{ color?: string; size?: string }>`
  ${({ size }) =>
    size && size === 'small'
      ? `
    width: var(--spaces-7);
    height: var(--spaces-7);
  `
      : `
    width: var(--spaces-11);
    height: var(--spaces-11);
  `}

  border-radius: 100%;
  background-color: ${({ color }) => 'var(--color-' + color + ')'};
  display: flex;
  justify-content: center;
  align-items: center;
`

const Ico = styled.span`
  font-size: var(--spaces-5);
`

interface IconRoundProps {
  icon?: string
  color?: string
  size?: string
}

const IconRound: React.FC<IconRoundProps> = ({ icon, color, size }) => {
  return (
    <IcoRound color={color} size={size}>
      <Ico>{icon}</Ico>
    </IcoRound>
  )
}

export default IconRound
