import React from 'react'
import styled from 'styled-components'
import { Fill, Top } from 'react-spaces'
import PreviewPanel from './PreviewPanel'
import TestPanel from './TestPanel'
import { useEditorState } from 'hooks/editor-state'

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

enum TAB {
  PREVIEW,
  TEST,
}

const RightPanel = () => {
  const [tab, setTab] = useEditorState('right-tab', TAB.PREVIEW)

  return (
    <Container>
      <Top size={50}>
        <Tabs>
          <Tab selected={tab === TAB.PREVIEW} onClick={() => setTab(TAB.PREVIEW)}>Preview</Tab>
          <Tab selected={tab === TAB.TEST} onClick={() => setTab(TAB.TEST)}>Test</Tab>
        </Tabs>
      </Top>

      <Fill scrollable={tab === TAB.PREVIEW}>
        {tab === TAB.PREVIEW ? <PreviewPanel /> : <TestPanel />}
      </Fill>
    </Container>
  );
}

export default RightPanel;
