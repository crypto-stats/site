import React from 'react'
import styled from 'styled-components'
import { Adapter } from '@cryptostats/sdk'
import QueryForm from './QueryForm'
import { useEditorState } from 'hooks/editor-state'
import { IPFS_GATEWAY } from 'resources/constants'

const Container = styled.div``

const Header = styled.div`
  border-top: solid 1px #4a4a4d;
  border-bottom: solid 1px #4a4a4d;
  padding: 16px;
  background: #2f2f2f;
  cursor: pointer;

  &:hover {
    background: #262626;
  }
`

const Icon = styled.img<{ size?: string }>`
  width: auto;
  margin-right: 16px;

  ${({ size }) =>
    size === 'small'
      ? `
    max-height: 16px;
    margin-right: 16px;
  `
      : ``}
  ${({ size }) =>
    size === 'large'
      ? `
    max-height: 32px;
    margin-right: 32px;
  `
      : ``}
`

interface SubAdapterPreviewProps {
  subadapter: Adapter
  openByDefault: boolean
}

const SubAdapterTest: React.FC<SubAdapterPreviewProps> = ({ subadapter, openByDefault }) => {
  const [fileName] = useEditorState<string>('open-file')
  const [open, setOpen] = useEditorState(`subtest-${fileName}-${subadapter.id}-open`, openByDefault)

  // @ts-ignore
  const { name, subtitle, ...metadata } = subadapter.metadata.metadata

  if (!open) {
    return (
      <Header onClick={() => setOpen(true)}>
        {metadata.icon?.cid && (
          <Icon size="small" src={`${IPFS_GATEWAY}/ipfs/${metadata.icon.cid}`} />
        )}
        {name || subadapter.id}
        {subtitle ? ` - ${subtitle}` : null}
      </Header>
    )
  }

  const queries = Object.entries(subadapter.queries)

  return (
    <Container>
      <Header onClick={() => setOpen(false)}>
        {metadata.icon?.cid && (
          <Icon size="small" src={`${IPFS_GATEWAY}/ipfs/${metadata.icon.cid}`} />
        )}
        {name || subadapter.id}
        {subtitle ? ` - ${subtitle}` : null}
      </Header>

      <div>
        {queries.map(([queryName, fn]: [string, (...params: any[]) => Promise<any>]) => (
          <QueryForm
            key={queryName}
            id={queryName}
            storageKey={`subtest-${fileName}-${subadapter.id}-${queryName}`}
            fn={fn}
            openByDefault={queries.length === 1}
          />
        ))}
      </div>
    </Container>
  )
}

export default SubAdapterTest
