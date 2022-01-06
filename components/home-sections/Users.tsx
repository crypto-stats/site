import React from 'react'
import RowSection from 'components/RowSection'
import ColumnSection from 'components/ColumnSection'
import Text from 'components/Text'

const Users: React.FC = () => {
  return (
    <RowSection mt="140">
      <ColumnSection from="2" to="12">
        <Text tag="h3" type="title_highlight" mb="40" align="center">Who is using CryptoStats?</Text>
      </ColumnSection>
    </RowSection>
  )
}

export default Users
