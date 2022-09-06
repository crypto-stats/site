import { templates } from 'resources/subgraph-templates'
import styled from 'styled-components'

interface ContractTemplateSelector {
  selected: string[]
  onChange: (templates: string[]) => void
}

const List = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
`

const Item = styled.li<{ selected: boolean }>`
  list-style: none;
  background: ${({ selected }) => (selected ? '#99999977' : 'transparent')};
  border: solid 1px #aaaaaa;
  border-radius: 8px;
  color: ${({ selected }) => (selected ? 'var(--color-white);' : '#aaaaaa')};
  padding: 4px 12px;
  margin: 2px;

  &:hover {
    cursor: pointer;
    background: #44444477;
  }
`

export default function ContractTemplateSelector({ selected, onChange }: ContractTemplateSelector) {
  return (
    <List>
      {templates.map(template => (
        <Item
          selected={selected.includes(template.id)}
          onClick={
            selected.includes(template.id)
              ? () => onChange(selected.filter(item => item !== template.id))
              : () => onChange([...selected, template.id])
          }
        >
          {template.name || template.id}
        </Item>
      ))}
    </List>
  )
}
