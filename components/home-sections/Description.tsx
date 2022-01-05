import React from 'react'
import styled from 'styled-components'
import RowSection from 'components/RowSection'
import ColumnSection from 'components/ColumnSection'
import Text from 'components/Text'

const Row = styled.div`
  display: flex;
  flex: 1;
`

const Block = styled.div`
  border-radius: 20px;
  box-shadow: 0 2px 11px 1px rgba(0, 0, 0, 0.13);
  text-align: center;
  color: #838383;
  flex: 1;
  padding: 24px;
  margin: 0 7px;
  overflow: hidden;
  min-height: 100px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`

const CSBlock = styled(Block)`
  border: solid 3px #0477f4;
  box-shadow: 0 2px 464px 9px rgba(4, 119, 244, 0.17), 0 4px 11px 1px rgba(4, 119, 244, 0.27);
  background-image: url('/logo.svg');
  background-repeat: no-repeat;
  background-position: center;

  @media (max-width: 768px) {
    min-height: 60px;
    background-position-y: 70%;
  }
`

const ArrowBox = styled.div`
  height: 60px;
  position: relative;
  display: flex;
  justify-content: center;
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

const Hero: React.FC = () => {
  return (
    <RowSection mt="124" alignItems="center">
      <ColumnSection from="2" to="6">
        <Text tag="h3" type="title_highlight" mb="24">What is CryptoStats?</Text>
        <Text tag="p" type="content_big" mb="16">We are People. We are a Community, we are a DAO. We believe that Data should be open and accessible to everyone. For free and without barriers.</Text>
        <Text tag="p" type="content_big" mb="16">We are building the new source for Crypto Metrics that everyone can use in a trustfull way.</Text>
        <Text tag="p" type="content_big" mb="16">Thanks to Blockchain technology and the Community DAO processes, we are decentralizing data consuming. Working at the normalization layer we are able to provide neutral, high quality and verified endpoints that you don't have to trust.</Text>
        <Text tag="p" type="content_big" mb="16">Best in class projects are already using CryptoStats to empower their users with neutral and trustful data.</Text>
        <Text tag="p" type="content_big" mb="16">Want to know more?</Text>
      </ColumnSection>

      <ColumnSection from="7" to="12">
        <Block>Blockchains</Block>
        <ArrowBox>
          <Arrow dashed />
          <SideArrows />
        </ArrowBox>
        <Block>Indexers</Block>
        <ArrowBox>
          <Arrow dashed />
          <TopForkArrows />
        </ArrowBox>
        <CSBlock>Normalization &amp; Curation</CSBlock>
        <ArrowBox>
          <Arrow />
          <BottomForkArrows />
        </ArrowBox>
        <Block>Presentations</Block>
      </ColumnSection>
    </RowSection>
  )
}

export default Hero
