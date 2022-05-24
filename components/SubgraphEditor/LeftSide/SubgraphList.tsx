import React, { useState } from 'react'
import styled from 'styled-components'
import { Plus, ChevronDown, ChevronRight } from 'lucide-react'

import { LucideIcon } from 'components/layouts'
import { useSubgraphList, newSubgraph } from 'hooks/local-subgraphs'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: auto;

  .toggle-expand {
    &:hover {
      cursor: pointer;
    }
  }
`

const NewSubgraphButton = styled.button`
  display: inline-flex;
  align-items: center;
  background-color: inherit;
  border: none;
  color: var(--color-primary);
  padding: 16px 32px 32px;
  font-size: 16px;
  cursor: pointer;
  letter-spacing: 1.8px;
  text-transform: uppercase;

  > svg {
    margin-right: 8px;
    padding: 16px;
    border-radius: 50%;
    background-color: var(--color-primary);
    color: var(--color-white);
  }
`

const Label = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 16px;
  font-size: 14px;
  color: var(--color-white);
  text-transform: uppercase;
`

const List = styled.ul`
  padding: 0;
  margin: 0;
`

const ListItem = styled.li<{ $selected?: boolean }>`
  display: inline-flex;
  justify-content: space-between;
  font-size: 12px;
  color: ${({ $selected }) => ($selected ? 'var(--color-white)' : '#eeeeee')};
  background-color: ${({ $selected }) => ($selected ? 'var(--color-primary)' : 'inherit')};
  letter-spacing: 0;
  list-style: none;
  margin: 0;
  padding: 2px 32px;
  width: 100%;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: ${({ $selected }) => ($selected ? `var(--color-primary)` : '#7e90b43b')};
    color: white;
    cursor: pointer;
  }

  > .name {
    font-weight: ${({ $selected }) => ($selected ? 'bold' : '')};
  }
`

interface FileListProps {
  selected?: string | null
  onSelected: (id: string) => void
  filter?: string
}

export const SubgraphList: React.FC<FileListProps> = ({ selected, onSelected, filter }) => {
  let subgraphs = useSubgraphList()
  const [projectsExpanded, setProjectsExpanded] = useState({ local: true, wallet: false })

  if (filter && filter.length > 0) {
    subgraphs = subgraphs.filter(
      a => (a.name || 'New').toLowerCase().indexOf(filter.toLowerCase()) !== -1
    )
  }

  subgraphs = subgraphs.sort((a, b) => (a.name || 'New').localeCompare(b.name || 'New'))

  const toggleProjectsExpanded = (type: 'local' | 'wallet') =>
    setProjectsExpanded(prev => ({ ...prev, [type]: !prev[type] }))

  return (
    <Container>
      <NewSubgraphButton onClick={() => newSubgraph()}>
        <Plus size={16} /> New Subgraph
      </NewSubgraphButton>
      <Label>
        <LucideIcon
          className="toggle-expand"
          size={16}
          onClick={() => toggleProjectsExpanded('local')}
          Icon={projectsExpanded.local ? ChevronDown : ChevronRight}
        />
        Local Projects
      </Label>

      {projectsExpanded.local ? (
        <List>
          {subgraphs.map(subgraph => (
            <ListItem
              $selected={selected === subgraph.id}
              key={subgraph.id}
              onClick={() => onSelected(subgraph.id)}>
              <span className="name">{subgraph.name}</span>
              <span>{subgraph.publications.length > 0 ? 'published' : 'draft'} </span>
            </ListItem>
          ))}
        </List>
      ) : null}
    </Container>
  )
}
