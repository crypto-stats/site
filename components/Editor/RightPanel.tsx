import React, { useState } from 'react'
import styled from 'styled-components'
import PreviewPanel from './PreviewPanel'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  color: #ffffff;
`

const Tabs = styled.ul`
  display: flex;
  margin: 0;
  padding: 0;
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
    border-bottom: solid 1px #4a4a4d;
    border-left: solid 1px #4a4a4d;
  `}
`

const Content = styled.div`
  flex: 1;
  overflow: auto;
`

const RightPanel = () => {
  const [tab, setTab] = useState('preview')

  return (
    <Container>
      <Tabs>
        <Tab selected={tab === 'preview'} onClick={() => setTab('preview')}>Preview</Tab>
        <Tab selected={tab === 'test'} onClick={() => setTab('test')}>Test</Tab>
      </Tabs>

      <Content>
        {tab === 'preview' ? <PreviewPanel /> : 'Test'}
      </Content>
    </Container>
  );
}

export default RightPanel;
