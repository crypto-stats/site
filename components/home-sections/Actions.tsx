import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import HeroCard from './HeroCard'
import CollectionCard from './CollectionCard'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Column = styled.div`
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  padding: 30px;
`

const SectionHeader = styled.h3`
  font-size: 24px;
  font-weight: bold;
  color: #002750;
`

const Row = styled.div`
  display: flex;
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const Description = styled.p`
  flex: 1;
`

const Graphic = styled.div<{ background?: string }>`
  aspect-ratio: 3 / 2;
  position: relative;
  background-size: 80%;
  background-position: center;
  background-repeat: no-repeat;

  ${({ background }) => background && `background-image: url('${background}');`}
`

const BottomRow = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  width: 700px;
  max-width: 100%;
  margin: 4px 8px;
`

const Button = styled.a`
  display: block;
  background: transparent;
  padding: 4px 12px;
  border: solid 1px #0477f4;
  color: #0477f4;
  text-decoration: none;
  align-self: center;
  margin: 20px;

  &:hover {
    background: #c5e1ff;
  }
`

const Actions: React.FC = () => {
  return (
    <Container>
      <Row>
        <Column>
          <SectionHeader>Create</SectionHeader>

          <Description>
            Create and update the adapers that provide data to CryptoStats.
            <br />
            Write, test and publish the code right in the browser!
          </Description>

          <Graphic background="/editor-thumbnail.png"/>

          <Link href="/editor" passHref>
            <Button>Open the adapter editor</Button>
          </Link>
        </Column>

        <Column>
          <SectionHeader>Discover</SectionHeader>

          <Description>
            Review a wide range of data metrics, covering protocols across the crypto space.
          </Description>

          <Graphic>
            <CollectionCard position="TopLeft" title="DAO Treasury Balance" />
            <CollectionCard position="Center" title="Lending Rate" />
            <CollectionCard position="BottomRight" title="Total Fee Revenue" />
          </Graphic>

          <Link href="/discover" passHref>
            <Button>Browse data sets</Button>
          </Link>
        </Column>
      </Row>

      <BottomRow>
        <SectionHeader>Consume and use data</SectionHeader>
        <Description>
          Use trustworthy data metrics in your website or dapp.
          <br />
          It's free and always will be
        </Description>
        
        <HeroCard title="Uniswap Fees" subtitle="Preview">
          <div>Adapter name</div>
          <div>Uniswap</div>
        </HeroCard>

        <Button href="#">Read the docs</Button>
      </BottomRow>
    </Container>
  )
}

export default Actions
