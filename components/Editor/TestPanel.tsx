import React from 'react'
import styled from 'styled-components'
import { Fill } from 'react-spaces'
import { Adapter } from '@cryptostats/sdk'
import { useCompiler } from 'hooks/compiler'
import SubAdapterTest from './SubAdapterTest'

const Container = styled(Fill)`
  > .spaces-resize-handle {
    border-top: solid 2px #4a4a4d;
    box-sizing: border-box;
  }
`

const Main = styled(Fill)``

const Label = styled.div`
  font-size: 14px;
  color: #6b6b6b;
  letter-spacing: 1.1px;
  text-transform: uppercase;
  margin: 16px;
`

const TabContentIntro = styled.div`
  font-size: 14px;
  color: #808080;
  line-height: 19px;
  margin: 16px 16px 24px;
`

const PreviewPanel: React.FC = () => {
  const { module, list, processing } = useCompiler()

  if (!module) {
    if (processing) {
      return <div>Building adapter...</div>
    } else {
      return <div>Unable to build adapter</div>
    }
  }

  return (
    <Container>
      <Main scrollable={true}>
        <TabContentIntro>
          In order to publish your Adapter you need to test the query you wrote.
        </TabContentIntro>
        <Label>Queries to test</Label>
        {list &&
          list.adapters.map((adapter: Adapter) => (
            <SubAdapterTest
              key={adapter.id}
              subadapter={adapter}
              openByDefault={list.adapters.length === 1}
            />
          ))}
      </Main>
    </Container>
  )
}

export default PreviewPanel
