import React, { useState } from 'react'
import styled from 'styled-components'
import { Fill, Top } from 'react-spaces'
import PreviewPanel from './PreviewPanel'
import TestPanel from './TestPanel'

const Container = styled(Fill)`
  color: #ffffff;
  background-color: #212121;
`

const Tabs = styled.ul`
  display: flex;
  margin: 0;
  padding: 0;
  height: 50px;
`

const Tab = styled.li<{ selected?: boolean }>`
  list-style: none;
  flex: 1;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  justify-content: center;


  ${({ selected }) => !selected && `
    background: #2f2f2f;
    border-bottom: 1px solid #4A4A4D;
    border-left: 1px solid #4A4A4D;
    cursor: pointer;

    &:hover {
      background: #222222;
    }
  `}
`

const RightPanel = () => {
  const [tab, setTab] = useState('preview')

  return (
    <Container>
      <Top size={50}>
        <Tabs>
          <Tab selected={tab === 'preview'} onClick={() => setTab('preview')}>Preview</Tab>
          <Tab selected={tab === 'test'} onClick={() => setTab('test')}>Test</Tab>
        </Tabs>
      </Top>

      <Fill scrollable={tab === 'preview'}>
        {tab === 'preview' ? <PreviewPanel /> : <TestPanel />}
      </Fill>
    </Container>
  );
}

export default RightPanel;
