import React from 'react';
import styled from 'styled-components';

const IconElement = styled.i<{ type?: string, size?: string }>`
  display: inline-block;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  /* margin-right: 8px; */
  width: var(--spaces-5);
  height: var(--spaces-5);

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

  ${ ({type}) => type && type === "ethereum" && `
    background-image: url("/Icon/ico-eth.svg");
  `}

  ${ ({type}) => type && type === "bitcoin" && `
    background-image: url("/Icon/ico-btc.svg");
  `}

  ${ ({type}) => type && type === "cardano" && `
    background-image: url("/Icon/ico-ada.svg");
  `}

  ${ ({type}) => type && type === "polygon" && `
    background-image: url("/Icon/ico-matic.svg");
  `}

  ${ ({type}) => type && type === "uniswap" && `
    background-image: url("/Icon/ico-uni.svg");
  `}

  ${ ({type}) => type && type === "aave" && `
    background-image: url("/Icon/ico-ave.svg");
  `}

  ${ ({type}) => type && type === "zerion" && `
    background-image: url("/Icon/ico-zerion.png");
  `}

  ${ ({type}) => type && type === "thegraph" && `
    background-image: url("/Icon/ico-thegraph.png");
  `}

  ${ ({type}) => type && type === "coinmetrics" && `
    background-image: url("/Icon/ico-coinmetrics.png");
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