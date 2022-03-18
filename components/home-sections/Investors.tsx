import React from "react"
import RowSection from "components/RowSection"
import ColumnSection from "components/ColumnSection"
import Text from "components/Text"

const Investors: React.FC = () => {
  return (
    <RowSection mt='140'>
      <ColumnSection from='2' to='12'>
        <Text tag='h3' type='title_highlight' mb='40' align='center'>
          Our investors
        </Text>
        <Text tag='p' type='title' align='center'>
          None!
        </Text>
        <Text tag='p' type='description' mt='40' align='center'>
          CryptoStats is a community-driven project, with no backing by VCs or other investors.
        </Text>
      </ColumnSection>
    </RowSection>
  )
}

export default Investors
