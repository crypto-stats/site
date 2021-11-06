import React, { PropTypes } from 'react'
import styled from 'styled-components'
import { useCompiler } from 'hooks/compiler'
import Attribute from '../Attribute'

const Container = styled.div`
  margin: 16px;
`

const PreviewPanel: React.FC = () => {
  const { module, processing } = useCompiler()

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
    </Container>
  )
}

export default PreviewPanel
