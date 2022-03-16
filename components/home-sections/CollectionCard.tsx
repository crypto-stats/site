import React from 'react'
import styled from 'styled-components'
import { Position, Positionable } from './Positionable'
import collectionMetadata from 'resources/collection-metadata'
import IconRound from 'components/IconRound'
import Text from 'components/Text'

const Card = styled(Positionable)`
  width: 100%;
  border-radius: 6px;
  background: #ffffff;
  border: 1px solid var(--color-primary-800);
  padding: var(--spaces-4);
  display: flex;
  align-items: center;
  transition: var(--transition-fast);

  &:hover {
    box-shadow: 0 2px 11px 1px rgba(0, 0, 0, 0.13);
  }

  @media (min-width: 768px) {
    width: 80%;
  }
`

const Column = styled.div`
  flex: 1;
  margin-left: var(--spaces-3);
`

interface CollectionCardProps {
  position: Position
  collection: string
}

const CollectionCard: React.FC<CollectionCardProps> = ({ position, collection }) => {
  const metadata = collectionMetadata[collection]

  return (
    <Card position={position}>
      <IconRound icon={metadata.icon} color={metadata.iconColor} size='small' />
      <Column>
        <Text tag='p' type='content_big'>
          {metadata.name}
        </Text>
      </Column>
    </Card>
  )
}

export default CollectionCard
