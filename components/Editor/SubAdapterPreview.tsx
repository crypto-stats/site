import React, { useState } from 'react'
import styled from 'styled-components'
import { Adapter } from '@cryptostats/sdk'
import { useCompiler } from 'hooks/compiler'
import Attribute from '../Attribute'

const Container = styled.div`
  margin: 16px;
`

const Icon = styled.img`
  max-width: 50px;
  max-height: 50px;
`

interface SubAdapterPreviewProps {
  subadapter: Adapter
  openByDefault: boolean
}

const SubAdapterPreview: React.FC<SubAdapterPreviewProps> = ({ subadapter, openByDefault }) => {
  const [open, setOpen] = useState(openByDefault)

  console.log(subadapter)
  
  const { name, ...metadata } = subadapter.metadata.metadata


  if (!open) {
    return (
      <div onClick={() => setOpen(true)}>
        {name || subadapter.id}
      </div>
    )
  }

  return (
    <Container>
      <div onClick={() => setOpen(false)}>{name || subadapter.id}</div>

      <div>
        {Object.entries(metadata).map(([key, val]) => (
          <Attribute name={key} key={key}>
            {val.cid ? (
              <div>
                <Icon src={`https://ipfs.io/ipfs/${val.cid}`} />
                <div>{val.cid}</div>
              </div>
            ) : (
              <pre>{JSON.stringify(val, null, 2)}</pre>
            )}
          </Attribute>
        ))}
      </div>
    </Container>
  )
}

export default SubAdapterPreview
