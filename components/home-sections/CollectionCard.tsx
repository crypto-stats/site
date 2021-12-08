import React from 'react'
import styled from 'styled-components'
import { Position, Positionable } from './Positionable'

const Card = styled(Positionable)`
  width: 80%;
  height: 40%;
  box-shadow: 0 2px 11px 1px rgba(0, 0, 0, 0.13);
  border-radius: 6px;
  background: #ffffff;
  padding: 8px;
  display: flex;

  &:before {
    content: '';
    display: block;
    height: 50px;
    width: 50px;
    background: #d9d9d9;
    border-radius: 50px;
    align-self: center;
  }
`

const Column = styled.div`
  flex: 1;
`

const CardTitle = styled.div``

interface CollectionCardProps {
  position: Position
  title: string
}

const CollectionCard: React.FC<CollectionCardProps> = ({ position, title }) => {
return (
  <Card position={position}>
    <Column>
      <CardTitle>{title}</CardTitle>
    </Column>
  </Card>
)
}

export default CollectionCard
