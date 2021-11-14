import React from 'react'
import styled from 'styled-components'
import { Fill, BottomResizable } from 'react-spaces'
import { Adapter } from '@cryptostats/sdk'
import { useCompiler } from 'hooks/compiler'
import SubAdapterTest from './SubAdapterTest'

const Container = styled(Fill)`
  > .spaces-resize-handle {
    border-top: solid 2px #4a4a4d;
    box-sizing: border-box;
  }
`

const Main = styled(Fill)`
  padding: 16px;
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
        {list && list.adapters.map((adapter: Adapter) => (
          <SubAdapterTest
            key={adapter.id}
            subadapter={adapter}
            openByDefault={list.adapters.length === 1}
          />
        ))}
      </Main>

      <BottomResizable size={100}>Console</BottomResizable>
    </Container>
  )
}

export default PreviewPanel
