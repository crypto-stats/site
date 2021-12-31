import React from 'react';
import styled from 'styled-components';

const IcoRound = styled.div<{color?: string}>`
  width: var(--spaces-11);
  height: var(--spaces-11);
  border-radius: 100%;
  background-color: ${({color}) => 'var(--color-'+color+')' };
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
}

const IconRound: React.FC<IconRoundProps> = ({ icon, color }) => {
  return (
    <IcoRound color={color}>
      <Ico>
        {icon}
      </Ico>
    </IcoRound>
  )
}

export default IconRound;