import React from 'react'
import styled from 'styled-components'
import { SubgraphData } from 'hooks/local-subgraphs'
import { useSubgraphRunner } from 'hooks/useSubgraphRunner'

const Container = styled.div``

const Header = styled.div`
  border-top: solid 1px #4a4a4d;
  border-bottom: solid 1px #4a4a4d;
  padding: 16px;
  background: #2f2f2f;
  margin: 0 -16px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;

  &:hover {
    background: #262626;
  }
`

const Body = styled.div`
  padding: var(--spaces-4) var(--spaces-2);
`

interface SubgraphTesterProps {
  subgraph: SubgraphData
}

const SubgraphTester: React.FC<SubgraphTesterProps> = ({ subgraph }) => {
  const { compile } = useSubgraphRunner(subgraph)

  return (
    <Container>
      <Header>Test</Header>

      <Body>
        <button onClick={compile}>Compile</button>
      </Body>
    </Container>
  )
}

export default SubgraphTester
