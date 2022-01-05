import React from 'react';
import styled from 'styled-components';

const IconElement = styled.i<{ type?: string, size?: string }>`
  display: inline-block;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  margin-right: 8px;

  ${ ({size}) => size && size === "small" && `
    width: var(--spaces-4);
    height: var(--spaces-4);
  `}

  ${ ({type}) => type && type === "arbitrum" && `
    background-image: url("/Icon/ico-arbitrum.svg");
  `}
  ${ ({type}) => type && type === "gitcoin" && `
    background-image: url("/Icon/ico-gitcoin.png");
  `}
  ${ ({type}) => type && type === "yearn" && `
    background-image: url("/Icon/ico-yearn.svg");
  `}
  
`

interface IconProps {
  type?: string
  size?: string
}

const Icon: React.FC<IconProps> = ({ type, size }) => {
  return (
    <IconElement type={type} size={size} />
  )
}

export default Icon;