import React from 'react'
import { List } from '@cryptostats/sdk' // TODO: get Adapter from package
import QueryForm from './QueryForm'

interface ListPreviewProps {
  list: List;
}

const ListPreview: React.FC<ListPreviewProps> = ({ list }) => {
  return (
    <div>
      {list.adapters.map((adapter: any) => (
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

export default ListPreview
