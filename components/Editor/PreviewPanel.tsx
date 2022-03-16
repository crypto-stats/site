import React from 'react'
import styled from 'styled-components'
import { Adapter } from '@cryptostats/sdk'
import { useCompiler } from 'hooks/compiler'
import Attribute from '../Attribute'
import SubAdapterPreview from './SubAdapterPreview'

const Container = styled.div`
  margin: 16px;
`

const SectionHeader = styled.div`
  font-size: 14px;
  color: #6b6b6b;
  margin: 20px 0 16px;
  text-transform: uppercase;
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
      {processing && <div>Building adapter...</div>}
      <SectionHeader>Adapter Metadata</SectionHeader>
      <Attribute name='Name'>{module.name}</Attribute>
      <Attribute name='Version'>{module.version}</Attribute>
      <Attribute name='License'>{module.license}</Attribute>

      <SectionHeader>Sub Adapters - {list?.adapters.length}</SectionHeader>
      <div>
        {list &&
          list.adapters.map((adapter: Adapter) => (
            <SubAdapterPreview
              key={adapter.id}
              subadapter={adapter}
              openByDefault={list.adapters.length === 1}
            />
          ))}
      </div>
    </Container>
  )
}

export default PreviewPanel
