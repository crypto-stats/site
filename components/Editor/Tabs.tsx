import React from 'react'
import styled from 'styled-components'
import CloseIcon from 'components/CloseIcon'

const TabRow = styled.div`
  display: flex;
  flex: 1;
`

const Tab = styled.div`
  display: flex;
  font-size: 16px;
  font-weight: medium;
  color: #ffffff;
  background: #212121;
  align-items: center;
  padding: 0 16px;
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

interface TabsProps {
  current?: string | null
  onClose?: () => void
}

const Tabs: React.FC<TabsProps> = ({ current, onClose }) => {
  return (
    <TabRow>
      {current && (
        <Tab>
          <div>{current}</div>
          {onClose && (
            <CloseButton onClick={onClose}>
              <CloseIcon />
            </CloseButton>
          )}
        </Tab>
      )}
    </TabRow>
  )
}

export default Tabs
