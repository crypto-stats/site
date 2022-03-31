import React from 'react'
import styled from 'styled-components'
import CloseIcon from 'components/CloseIcon'

const TabRow = styled.div`
  display: flex;
  flex: 1;
`

const Tab = styled.div<{ $focused: boolean }>`
  display: flex;
  font-size: 16px;
  font-weight: medium;
  color: #ffffff;
  background: #212121;
  align-items: center;
  padding: 0 16px;
  opacity: ${props => (props.$focused ? '1' : 0.5)};

  &:hover {
    cursor: pointer;
  }
`

const CloseButton = styled.button`
  border: none;
  background: transparent;
  margin-left: 24px;
  cursor: pointer;
  width: 20px;
  height: 20px;
  padding: 0;

  & svg {
    fill: #888888;
  }
  &:hover svg {
    fill: #666666;
  }
`

export interface TabState {
  type: 'schema' | 'mapping'
  name?: string
  fileId?: string | null
  open: boolean
  focused: boolean
}

interface TabsProps {
  current?: string | null
  onClose?: (fileId?: string) => void
  onSelect: (fileId?: string) => void
  openTabs: TabState[]
}

export const Tabs = ({ onClose, openTabs, onSelect }: TabsProps) => {
  return (
    <TabRow>
      {openTabs.map(ot => (
        <Tab key={ot.fileId} $focused={ot.focused} onClick={() => onSelect(ot.fileId!)}>
          <div>{ot.name || ot.fileId || 'File'}</div>
          {ot.focused && onClose && (
            <CloseButton onClick={() => onClose(ot.fileId!)}>
              <CloseIcon />
            </CloseButton>
          )}
        </Tab>
      ))}
    </TabRow>
  )
}

export default Tabs
