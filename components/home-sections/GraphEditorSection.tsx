import Button from 'components/Button'
import ColumnSection from 'components/ColumnSection'
import RowSection from 'components/RowSection'
import Text from 'components/Text'
import Link from 'next/link'
import styled from 'styled-components'

const Container = styled.section`
  --color-strong-text: #ffffff;

  background-color: #0c0a1d;
  margin: 40px 0;
  padding: 40px 0;
`

const Graphic = styled.img`
  width: 100%;
  height: auto;
`

const Split = styled.div`
  display: flex;
  & > a {
    margin: 4px;
  }
`

export default function GraphEditorSection() {
  return (
    <Container>
      <RowSection alignItems="center">
        <ColumnSection from="2" to="6">
          <Text tag="h3" type="content_display" mb="24">
            Introducing: The Subgraph Editor
          </Text>
          <Text tag="p" type="content_big" mb="16">
            The easiest way to build subgraphs
          </Text>
          <Text tag="p" type="content_big" mb="24">
            Import smart contracts, write an indexer, and deploy to The Graph's decentralized
            network. All without leaving your browser.
          </Text>

          <Split>
            <Link href="/subgraph-editor" passHref>
              <Button variant="outline" size="large">
                Learn More
              </Button>
            </Link>
            <Link href="/editor/subgraph" passHref>
              <Button variant="outline" size="large">
                Try it out
              </Button>
            </Link>
          </Split>
        </ColumnSection>

        <ColumnSection from="7" to="12">
          <Graphic src="/subeditor-screenshot.png" />
        </ColumnSection>
      </RowSection>
    </Container>
  )
}
