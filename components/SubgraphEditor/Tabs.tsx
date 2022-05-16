import React from 'react'
import styled from 'styled-components'
import CloseIcon from 'components/CloseIcon'

const TabRow = styled.div`
  display: flex;
  flex: 1;
`

const Tab = styled.div<{ $focused: boolean }>`
  display: flex;
  justify-content: center;
  font-size: 16px;
  font-weight: medium;
  color: #ffffff;
  position: relative;
  margin-top: -3px;
  margin-right: -5px;
  padding: 0 16px;
  border-bottom: 42px solid ${({ $focused }) => ($focused ? '#212121' : '#4b555d')};
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  height: 0;
  width: 100px;
  z-index: ${({ $focused }) => ($focused ? 1 : 0)};

  .tab-text {
    position: absolute;
    top: 13px;
  }

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
  type: 'schema' | 'mapping' | 'config'
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
          <div className="tab-text">{ot.name || ot.fileId || 'File'}</div>
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
