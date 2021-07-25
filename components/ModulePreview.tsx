import React from 'react'
import { List, Adapter, Module } from '@cryptostats/sdk'
import QueryForm from './QueryForm'

interface ModulePreviewProps {
  module: Module;
  list: List;
}

const ModulePreview: React.FC<ModulePreviewProps> = ({ module, list }) => {
  return (
    <div>
      <div>Name: {module.name}</div>
      <div>Version: {module.version}</div>
      <div>License: {module.license}</div>
      
      {list.adapters.map((adapter: Adapter) => (
        <div key={adapter.id}>
          <div>{adapter.id}</div>
          <div>Metadata</div>
          <pre>{JSON.stringify(adapter.metadata, null, 2)}</pre>
          <div>Queries</div>
          <div>
            {Object.entries(adapter.queries).map(([id, fn]: [string, any]) => (
              <QueryForm id={id} fn={fn} key={id} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ModulePreview
