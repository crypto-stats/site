import React, { useState } from 'react'
import styled from 'styled-components'
import { Adapter } from '@cryptostats/sdk'
import Attribute from '../Attribute'
import { IPFS_GATEWAY } from 'resources/constants'

const Container = styled.div`
`

const Header = styled.div`
  border-top: solid 1px #4a4a4d;
  border-bottom: solid 1px #4a4a4d;
  padding: 16px;
  background: #2f2f2f;
  margin: 0 -16px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;

  &:hover {
    background: #262626;
  }
`

const Body = styled.div`
  padding: var(--spaces-4) var(--spaces-2);
`

const Value = styled.pre`
  white-space: pre-wrap;
  margin: 4px 0 10px;
  font-size: 14px;
`

const Icon = styled.img<{size?: string}>`
  width: auto;
  margin-right: 16px;
  
  ${({size})=> size === "small" ? `
    max-height: 16px;
    margin-right: 16px;
  ` : ``}
  ${({size})=> size === "large" ? `
    max-height: 32px;
    margin-right: 32px;
  ` : ``}
`

interface SubAdapterPreviewProps {
  subadapter: Adapter
  openByDefault: boolean
}

const SubAdapterPreview: React.FC<SubAdapterPreviewProps> = ({ subadapter, openByDefault }) => {
  const [open, setOpen] = useState(openByDefault)

  // @ts-ignore
  const { name, ...metadata } = subadapter.metadata.metadata

  if (!open) {
    return (
      <Header onClick={() => setOpen(true)}>
        {metadata.icon?.cid && <Icon size="small" src={`${IPFS_GATEWAY}/ipfs/${metadata.icon.cid}`} />}
        {name || subadapter.id}
        {metadata.subtitle ? ` - ${metadata.subtitle}` : null}
      </Header>
    )
  }

  return (
    <Container>
      <Header onClick={() => setOpen(false)}>
        {metadata.icon?.cid && <Icon size="small" src={`${IPFS_GATEWAY}/ipfs/${metadata.icon.cid}`} />}
        {name || subadapter.id}
        {metadata.subtitle ? ` - ${metadata.subtitle}` : null}
      </Header>

      <Body>
        {Object.entries(metadata).map(([key, val]: [string, any]) => (
          <Attribute name={key} key={key}>
            {val?.cid ? (
              <div>
                <Icon size="large" src={`${IPFS_GATEWAY}/ipfs/${val.cid}`} />
              </div>
            ) : (
              <Value>{JSON.stringify(val, null, 2)}</Value>
            )}
          </Attribute>
        ))}
      </Body>
    </Container>
  )
}

export default SubAdapterPreview
