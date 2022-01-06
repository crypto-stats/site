import React from 'react'
import styled from 'styled-components'
import { Position, Positionable } from './Positionable'
import collectionMetadata from 'resources/collection-metadata'
import IconRound from 'components/IconRound'

const Card = styled(Positionable)`
  width: 80%;
  height: 40%;
  box-shadow: 0 2px 11px 1px rgba(0, 0, 0, 0.13);
  border-radius: 6px;
  background: #ffffff;
  padding: 8px;
  display: flex;
  align-items: center;
`

const Column = styled.div`
  flex: 1;
  margin-left: 8px;
`

const CardTitle = styled.div``

interface CollectionCardProps {
  position: Position
  collection: string
}

const CollectionCard: React.FC<CollectionCardProps> = ({ position, collection }) => {
  const metadata = collectionMetadata[collection]

  return (
    <Card position={position}>
      <IconRound icon={metadata.icon} color={metadata.iconColor} />
      <Column>
        <CardTitle>{metadata.name}</CardTitle>
      </Column>
    </Card>
  )
}

export default CollectionCard
