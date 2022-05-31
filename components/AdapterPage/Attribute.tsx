import React from 'react'
import styled from 'styled-components'
import Text from 'components/Text'

const InfoBoxItem = styled.div`
  margin: 24px 0;
  padding: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (min-width: 768px) {
    margin: 0;
  }
`

const ValueWrapper = styled.div`
  margin: 8px 0 0;
  display: flex;
`

const InfoBoxValue = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`

const InfoBoxValueFullWidth = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  color: #000000;
`

const InfoBoxAuthor = styled.div`
  padding: 24px 24px 32px 24px;
`

interface AttributeProps {
  label: string
  buttons?: React.ReactNode
}

const Attribute: React.FC<AttributeProps> = ({ label, buttons, children }) => {
  if (label && label === 'Author') {
    return (
      <InfoBoxAuthor>
        <Text tag="p" type="label">
          {label}
        </Text>
        <InfoBoxValue tag="p" type="content_small">
          {children}
        </InfoBoxValue>
      </InfoBoxAuthor>
    )
  }

  return (
    <InfoBoxItem>
      <Text tag="p" type="label">
        {label}
      </Text>

      <ValueWrapper>
        {label === 'Collections' ? (
          <InfoBoxValueFullWidth tag="p" type="content_small">
            {children}
          </InfoBoxValueFullWidth>
        ) : (
          <InfoBoxValue tag="p" type="content_small">
            {children}
          </InfoBoxValue>
        )}
        {buttons}
      </ValueWrapper>
    </InfoBoxItem>
  )
}

export default Attribute
