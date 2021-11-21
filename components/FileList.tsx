import React from 'react'
import styled from 'styled-components'
import { useAdapterList, AdapterWithID } from 'hooks/local-adapters'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Label = styled.div`
  padding: 8px 4px;
  font-size: 14px;
  color: #6b6b6b;
`

const List = styled.ul`
  padding: 0;
  margin: 0;
`

const ListItem = styled.li<{ selected?: boolean }>`
  list-style: none;
  margin: 0;
  font-size: 14px;
  color: #c8c8c8;
  padding: 12px;
  height: 40px;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${(props) => props.selected ? `
    background: #7e90b43b;
    color: white;
    font-weight: bold;
  ` : ''}
`

interface FileListProps {
  selected?: string | null
  onSelected: (id: string) => void
}

const FileList: React.FC<FileListProps> = ({ selected, onSelected }) => {
  const adapters = useAdapterList()

  const sortedAdapters = adapters.sort(
    (a: AdapterWithID, b: AdapterWithID) => (a.name || 'New').localeCompare(b.name || 'New')
  )

  return (
    <Container>
      <Label>Saved in Browser</Label>

      <List>
        {sortedAdapters.map((adapter: AdapterWithID) => (
          <ListItem
            selected={selected === adapter.id}
            key={adapter.id}
            onClick={() => onSelected(adapter.id)}
          >
            {adapter.name}
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default FileList
