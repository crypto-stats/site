import React from 'react'
import styled from 'styled-components'
import { useAdapterList, AdapterWithID } from 'hooks/local-adapters'
import { SubgraphWithID, useSubgraphList } from 'hooks/useLocalSubgraph'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Label = styled.div`
  padding: 24px 16px 16px;
  font-size: 14px;
  color: #6b6b6b;
  text-transform: uppercase;
`

const List = styled.ul`
  padding: 0;
  margin: 0;
`

const ListItem = styled.li<{ selected?: boolean }>`
  font-size: 14px;
  color: #c8c8c8;
  letter-spacing: 0;
  list-style: none;
  margin: 0;
  padding: 12px 12px 12px 32px;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background: #7e90b43b;
    color: white;
    cursor: pointer;
  }

  ${props =>
    props.selected
      ? `
    background: #7e90b43b;
    color: white;
    font-weight: bold;
  `
      : ''}
`

export enum FileType {
  Adapter,
  Subgraph,
}

interface FileListProps {
  selected?: string | null
  onSelected: (id: string, type: FileType) => void
  filter?: string
}

const FileList: React.FC<FileListProps> = ({ selected, onSelected, filter }) => {
  let adapters = useAdapterList()
  let subgraphs = useSubgraphList()

  if (filter && filter.length > 0) {
    adapters = adapters.filter(
      (a: AdapterWithID) => (a.name || 'New').toLowerCase().indexOf(filter.toLowerCase()) !== -1
    )
  }

  adapters = adapters.sort((a: AdapterWithID, b: AdapterWithID) =>
    (a.name || 'New').localeCompare(b.name || 'New')
  )

  return (
    <Container>
      <Label>Saved in Browser ({adapters.length})</Label>

      <List>
        {adapters.map((adapter: AdapterWithID) => (
          <ListItem
            selected={selected === adapter.id}
            key={adapter.id}
            onClick={() => onSelected(adapter.id, FileType.Adapter)}
          >
            {adapter.name}
          </ListItem>
        ))}
      </List>

      <Label>Subgraphs ({subgraphs.length})</Label>

      <List>
        {subgraphs.map((subgraph: SubgraphWithID) => (
          <ListItem
            selected={selected === subgraph.id}
            key={subgraph.id}
            onClick={() => onSelected(subgraph.id, FileType.Subgraph)}
          >
            {subgraph.name}
          </ListItem>
        ))}
      </List>
    </Container>
  )
}

export default FileList
