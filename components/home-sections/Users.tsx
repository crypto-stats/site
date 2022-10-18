import React from 'react'
import styled from 'styled-components'
import RowSection from 'components/RowSection'
import ColumnSection from 'components/ColumnSection'
import Text from 'components/Text'

const UsedByGrid = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  & > img {
    height: 40px;
    width: auto;
  }

  & img + img {
    margin-left: var(--spaces-5);
  }
`

const Users: React.FC = () => {
  return (
    <>
      <RowSection mt="140">
        <ColumnSection from="2" to="12">
          <Text tag="h3" type="title_highlight" mb="40" align="center">
            Who is using CryptoStats?
          </Text>
        </ColumnSection>
      </RowSection>
      <RowSection mt="32">
        <ColumnSection from="2" to="12">
          <UsedByGrid>
            <img src="clients/bloomberg.png" alt="Bloomberg" style={{ height: '26px' }} />
            <img src="clients/cryptofees.png" alt="CryptoFees" />
            <img src="clients/cryptotester.png" alt="CryptoTesters" />
            <img src="clients/openbb.svg" alt="OpenBB" style={{ height: '' }} />
          </UsedByGrid>
        </ColumnSection>
      </RowSection>
    </>
  )
}

export default Users
