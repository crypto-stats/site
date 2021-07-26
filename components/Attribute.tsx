import React from 'react'
import styled from 'styled-components'

const AttributeContainer = styled.div`
  margin: 2px 0;
`

const Name = styled.div`
  font-size: 12px;
  color: #444444;
`

const Value = styled.div`
  color: #222222;
`;

const Attribute: React.FC = ({ name, children }) => {
  return (
    <AttributeContainer>
      <Name>{name}</Name>
      <Value>{children}</Value>
    </AttributeContainer>
  )
}

export default Attribute
