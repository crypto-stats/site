import React, { useState } from 'react'
import styled from 'styled-components'
import { Adapter } from '@cryptostats/sdk'
import QueryForm from './QueryForm'

const Container = styled.div`
  margin: 16px;
`

interface SubAdapterPreviewProps {
  subadapter: Adapter
  openByDefault: boolean
}

const SubAdapterTest: React.FC<SubAdapterPreviewProps> = ({ subadapter, openByDefault }) => {
  const [open, setOpen] = useState(openByDefault)

  // @ts-ignore
  const { name } = subadapter.metadata.metadata

  if (!open) {
    return (
      <div onClick={() => setOpen(true)}>
        {name || subadapter.id}
      </div>
    )
  }

  const queries = Object.entries(subadapter.queries)

  return (
    <Container>
      <div onClick={() => setOpen(false)}>{name || subadapter.id}</div>

      <div>
        {queries.map(([queryName, fn]: [string, (...params: any[]) => Promise<any>]) => (
          <QueryForm
            key={queryName}
            id={queryName}
            fn={fn}
          />
        ))}
      </div>
    </Container>
  )
}

export default SubAdapterTest
