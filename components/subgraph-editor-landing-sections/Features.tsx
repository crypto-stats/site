import React from 'react'
import styled from 'styled-components'
import RowSection from 'components/RowSection'
import ColumnSection from 'components/ColumnSection'
import Text from 'components/Text'

const Graphic = styled.img`
  width: 100%;
  height: auto;
`

export default function Features() {
  return (
    <RowSection alignItems="center">
      <ColumnSection from="2" to="6">
        <Text tag="h3" type="title_highlight" mb="24">
          Web-based editor
        </Text>
        <Text tag="p" type="content_big" mb="16">
          Build and deploy subgraphs without ever leaving your browser.
        </Text>
      </ColumnSection>

      <ColumnSection from="7" to="12">
        <Graphic src="/subeditor-screenshot.png" />
      </ColumnSection>
    </RowSection>
  )
}
