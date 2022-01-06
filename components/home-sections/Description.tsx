import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import RowSection from 'components/RowSection'
import ColumnSection from 'components/ColumnSection'
import Text from 'components/Text'
import Button from 'components/Button'
import Icon from 'components/Icon'

const Block = styled(Text)`
  border-radius: 20px;
  border: 1px solid var(--color-primary-800);
  flex: 1;
  padding: 24px;
  margin: 0 7px;
  overflow: hidden;
  min-height: 80px;
  opacity: .7;
  transition: var(--transition-fast);

  &:hover {
    opacity: 1;
    box-shadow: 0 2px 14px 1px rgba(0, 0, 0, 0.13);
  }
`

const CSBlock = styled(Block)`
  border: solid 2px #0477f4;
  box-shadow: 0 2px 464px 9px rgba(4, 119, 244, 0.17), 0 4px 11px 1px rgba(4, 119, 244, 0.27);
  background-image: url('/logo.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-position-y: 60%;
  opacity: 1;

  &:hover {
    opacity: 1;
    box-shadow: 0 2px 464px 9px rgba(4, 119, 244, 0.17), 0 4px 11px 1px rgba(4, 119, 244, 0.27);
  }
`

const ArrowBox = styled.div`
  height: var(--spaces-8);
  position: relative;
  display: flex;
  justify-content: center;
  margin: var(--spaces-3) 0;
  opacity: .65;
`

const Arrow = styled.div<{ dashed?: boolean }>`
  width: 0;
  border-left: ${({ dashed }) => dashed ? 'dashed' : 'solid'} 2px #0477f4;
  position: relative;
  margin-bottom: 2px;

  &:before {
    content: '';
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #0477f4;
    position: absolute;
    bottom: -2px;
    left: -10.5px;
  }
`

const ForkArrows = styled.div`
  position: absolute;
  border-color: #0477f4;
  border-style: solid;
  border-width: 2px;
  left: 16.66%;
  right: 16.66%;
`

const BottomForkArrows = styled(ForkArrows)`
  border-bottom-style: none;
  top: 50%;
  bottom: 0;
  margin-bottom: 2px;

  &:before, &:after {
    content: '';
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #0477f4;
    position: absolute;
    bottom: -2px;
  }
  &:before {
    left: -10.5px;
  }
  &:after {
    right: -10.5px;
  }
`

const SideArrows = styled(BottomForkArrows)`
  top: 0;
  border-style: dashed;
  border-top-style: none;
  border-bottom-style: none;
`

const TopForkArrows = styled(ForkArrows)`
  border-style: dashed;
  border-top-style: none;
  top: 0;
  bottom: 50%;
`

const IconsGrid = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: var(--spaces-4);

  & > i + i {
    margin-left: var(--spaces-4);
  }
  
  & > img {
    max-height: 40px;
    width: auto;
  }
  & > img + img {
    margin-left: var(--spaces-4);
  }
`

const Description: React.FC = () => {
  return (
    <RowSection alignItems="center">
      <ColumnSection from="2" to="6">
        <Text tag="h3" type="title_highlight" mb="24">What is CryptoStats?</Text>
        <Text tag="p" type="content_big" mb="16">We are People. We are a Community, we are a DAO. We believe that Data should be open and accessible to everyone. For free and without barriers.</Text>
        <Text tag="p" type="content_big" mb="16">We are building the new source for Crypto Metrics that everyone can use in a trustfull way.</Text>
        <Text tag="p" type="content_big" mb="16">Thanks to Blockchain technology and the Community DAO processes, we are decentralizing data consuming. Working at the normalization layer we are able to provide neutral, high quality and verified endpoints that you don't have to trust.</Text>
        <Text tag="p" type="content_big" mb="16">Best in class projects are already using CryptoStats to empower their users with neutral and trustful data.</Text>
        <Text tag="p" type="content_big" mb="16">Want to know more?</Text>
        <Link href="/discover" passHref>
          <Button variant="outline" size="large">See how it works</Button>
        </Link>
      </ColumnSection>

      <ColumnSection from="7" to="12">
        <Block>
          <Text tag="p" type="label" align="center">Blockchains &amp; Protocols</Text>
          <IconsGrid>
            <Icon type="ethereum" />
            <Icon type="bitcoin" />
            <Icon type="cardano" />
            <Icon type="polygon" />
            <Icon type="uniswap" />
            <Icon type="aave" />
          </IconsGrid>
        </Block>
        <ArrowBox>
          <Arrow dashed />
          <SideArrows />
        </ArrowBox>
        <Block>
          <Text tag="p" type="label" align="center">Indexers</Text>
          <IconsGrid>
            <Icon type="zerion" />
            <Icon type="thegraph" />
            <Icon type="coinmetrics" />
          </IconsGrid>
        </Block>
        <ArrowBox>
          <Arrow dashed />
          <TopForkArrows />
        </ArrowBox>
        <CSBlock>
          <Text tag="p" type="label" align="center">Normalization &amp; Curation</Text>
        </CSBlock>
        <ArrowBox>
          <Arrow />
          <BottomForkArrows />
        </ArrowBox>
        <Block>
          <Text tag="p" type="label" align="center">Presentations</Text>
          <IconsGrid>
            <img src="clients/bloomberg.png" alt="Bloomberg" style={{height: "26px"}}/>
            <img src="clients/cryptofees.png" alt="CryptoFees" />
            <img src="clients/cryptotester.png" alt="CryptoTesters" />
          </IconsGrid>
        </Block>
      </ColumnSection>
    </RowSection>
  )
}

export default Description
