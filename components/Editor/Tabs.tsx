import React from 'react'
import styled from 'styled-components'

const TabRow = styled.div`
  display: flex;
  flex: 1;
`

const Tab = styled.div`
  display: flex;
  border-right: solid 1px #dddddd;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  background: #4a4a4d;
  align-items: center;
  padding: 4px 12px;
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
          {onClose && <button onClick={onClose}>X</button>}
        </Tab>
      )}
    </TabRow>
  )
}

export default Tabs
