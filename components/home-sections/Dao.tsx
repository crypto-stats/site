import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import RowSection from 'components/RowSection'
import ColumnSection from 'components/ColumnSection'
import Text from 'components/Text'
import Button from 'components/Button'

const DaoSectionWrapper = styled.section`
  background-color: var(--color-primary-400);
  padding: var(--spaces-13) 0;
  margin-top: var(--spaces-13);
`

const Dao: React.FC = () => {
  return (
    <DaoSectionWrapper>
      <RowSection>
        <ColumnSection from="3" to="11">
          <Text tag="h3" type="title_highlight" mb="40" align="center">CryptoStat Community</Text>
          <Text tag="p" type="content_display" align="center" mb="32">The entire dApp and Data is governed and maintained by the community. Join us and contribute to create and verify new adapters, open new collections and maintain the library up to date.</Text>
          <Link href="https://discord.gg/VzyAtUk78f">
            <Button variant="outline" size="large" icon="Discord" centered>Join the Discord</Button>
          </Link>
        </ColumnSection>
      </RowSection>
    </DaoSectionWrapper>
  )
}

export default Dao
