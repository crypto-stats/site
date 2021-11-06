import React, { PropTypes } from 'react'
import styled from 'styled-components'
import { Adapter } from '@cryptostats/sdk'
import { useCompiler } from 'hooks/compiler'
import Attribute from '../Attribute'
import SubAdapterPreview from './SubAdapterPreview'

const Container = styled.div`
  margin: 16px;
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
      { processing && (
        <div>Building adapter...</div>
      )}
      <Attribute name="Name">{module.name}</Attribute>
      <Attribute name="Version">{module.version}</Attribute>
      <Attribute name="License">{module.license}</Attribute>

      <div>
        {list.adapters.map((adapter: Adapter) => (
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
