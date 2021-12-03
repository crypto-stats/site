import React, { useState } from 'react'
import styled from 'styled-components'
import { Adapter } from '@cryptostats/sdk'
import Attribute from '../Attribute'

const Container = styled.div`
`

const Header = styled.div`
  border-top: solid 1px #4a4a4d;
  border-bottom: solid 1px #4a4a4d;
  padding: 16px;
  background: #2f2f2f;
  margin: 0 -16px;

  &:hover {
    background: #262626;
  }
`

const Value = styled.pre`
  white-space: pre-wrap;
  margin: 4px 0 10px;
  font-size: 14px;
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

  // @ts-ignore
  const { name, ...metadata } = subadapter.metadata.metadata

  if (!open) {
    return (
      <Header onClick={() => setOpen(true)}>
        {name || subadapter.id}
        {metadata.subtitle ? ` - ${metadata.subtitle}` : null}
      </Header>
    )
  }

  return (
    <Container>
      <Header onClick={() => setOpen(false)}>
        {name || subadapter.id}
        {metadata.subtitle ? ` - ${metadata.subtitle}` : null}
      </Header>

      <div>
        {Object.entries(metadata).map(([key, val]: [string, any]) => (
          <Attribute name={key} key={key}>
            {val?.cid ? (
              <div>
                <Icon src={`https://ipfs.io/ipfs/${val.cid}`} />
              </div>
            ) : (
              <Value>{JSON.stringify(val, null, 2)}</Value>
            )}
          </Attribute>
        ))}
      </div>
    </Container>
  )
}

export default SubAdapterPreview
