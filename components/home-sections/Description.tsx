import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  height: 776px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    margin: 40px 20px;
    height: unset;
  }
`

const Column = styled.div`
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
`

const Diagram = styled.div`
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  align-self: stretch;
`

const SectionHeader = styled.h3`
  font-size: 24px;
  font-weight: bold;
  color: #002750;
`

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
  padding: 12px;
  margin: 0 7px;
  overflow: hidden;

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
    <Container>
      <Column>
        <SectionHeader>What is CryptoStats?</SectionHeader>

        <p>CryptoStats is a decentralized protocol for trustworthy data metrics for the crypto ecosystem.</p>
        <p>Verified adapters pull data from various indexers, normalize it, and make it freely available to all.</p>
      </Column>

      <Diagram>
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
        <Row>
          <Block>Presentation</Block>
          <Block>Presentation</Block>
          <Block>Presentation</Block>
        </Row>
      </Diagram>
    </Container>
  )
}

export default Hero
