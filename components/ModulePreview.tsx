import React from 'react'
import styled from 'styled-components'
import { List, Adapter, Module } from '@cryptostats/sdk'
import Attribute from './Attribute'
import QueryForm from './QueryForm'

const ModuleCard = styled.div`
  background: #e5e5e5;
  margin: 4px;
  padding: 4px;
`
const AdapterCard = styled.div`
  background: #e0e0e0;
  margin: 4px;
  padding: 4px;
`

const Icon = styled.img`
  max-width: 100px;
  max-height: 100px;
`

interface ModulePreviewProps {
  module: Module;
  list: List;
}

const ModulePreview: React.FC<ModulePreviewProps> = ({ module, list }) => {
  return (
    <ModuleCard>
      <Attribute name="Name">{module.name}</Attribute>
      <Attribute name="Version">{module.version}</Attribute>
      <Attribute name="License">{module.license}</Attribute>
      
      {list.adapters.map((adapter: Adapter) => {
        const { icon, ...metadata } = adapter.metadata

        const iconUri = icon?.cid ? `https://ipfs.io/ipfs/${icon.cid}` : icon

        return (
          <AdapterCard key={adapter.id}>
            {iconUri && <Icon src={iconUri} />}
            <div>{adapter.id}</div>
            <Attribute name="Metadata">
              <pre>{JSON.stringify(metadata, null, 2)}</pre>
            </Attribute>
            <Attribute name="Queries">
              {Object.entries(adapter.queries).map(([id, fn]: [string, any]) => (
                <QueryForm id={id} fn={fn} key={id} />
              ))}
            </Attribute>
          </AdapterCard>
        )
      })}
    </ModuleCard>
  )
}

export default ModulePreview
