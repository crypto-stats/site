import React from 'react'
import styled from 'styled-components'

const AttributeContainer = styled.div`
  margin: 2px 0;
`

const Name = styled.div`
  font-size: 12px;
  color: #7b7b7b;
`

const Value = styled.div`
  font-size: 16px;
  color: #ffffff;
`;

const Attribute: React.FC<{ name: string }> = ({ name, children }) => {
  return (
    <AttributeContainer>
      <Name>{name}</Name>
      <Value>{children}</Value>
    </AttributeContainer>
  )
}

export default Attribute
