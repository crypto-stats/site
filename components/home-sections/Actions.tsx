import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import HeroCard from './HeroCard'
import CollectionCard from './CollectionCard'
import RowSection from 'components/RowSection'
import ColumnSection from 'components/ColumnSection'
import Text from 'components/Text'
import Button from 'components/Button'


const Graphic = styled.div<{ background?: string }>`
  aspect-ratio: 3 / 2;
  position: relative;
  background-size: 80%;
  background-position: center;
  background-repeat: no-repeat;

  ${({ background }) => background && `background-image: url('${background}');`}
`

const Actions: React.FC = () => {
  return (
    <> 
      <RowSection mt="120">
        <ColumnSection from="2" to="7">
          <Text tag="h3" type="title_highlight" mb="40" align="center">Create</Text>
          <Graphic background="/editor-thumbnail.png"/>
          <Text tag="p" type="content_big" mb="16">Create and update the adapers that provide data to CryptoStats. Write, test and publish the code right in the browser!</Text>
          <Link href="/editor" passHref>
            <Button variant="outline">Open the adapter editor</Button>
          </Link>
        </ColumnSection>
        <ColumnSection from="7" to="12">
          <Text tag="h3" type="title_highlight" mb="40" align="center">Discover</Text>
          <Graphic>
            <CollectionCard position="TopLeft" title="DAO Treasury Balance" />
            <CollectionCard position="Center" title="Lending Rate" />
            <CollectionCard position="BottomRight" title="Total Fee Revenue" />
          </Graphic>
          <Text tag="p" type="content_big" mb="16">Review a wide range of data metrics, covering protocols across the crypto space.</Text>
          <Link href="/discover" passHref>
            <Button variant="outline">Browse data sets</Button>
          </Link>
        </ColumnSection>
      </RowSection>

      <RowSection mt="64">
        <ColumnSection from="3" to="11">
          <Text tag="h3" type="title_highlight" mb="24" align="center">Consume and use data</Text>
          <Text tag="p" type="content_big" mb="32" align="center">Use trustworthy data metrics in your website or dapp. It's free and always will be</Text>
          <HeroCard title="Uniswap Fees" subtitle="Preview">
            <div>Adapter name</div>
            <div>Uniswap</div>
          </HeroCard>
          <Button variant="outline">Read the docs</Button>
        </ColumnSection>
      </RowSection>
    </>
  )
}

export default Actions
