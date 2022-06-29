import React from 'react'
import styled from 'styled-components'
import { Top } from 'react-spaces'
import CloseIcon from 'components/CloseIcon'
import { useConsole } from 'hooks/console'

const Header = styled(Top)`
  border-bottom: solid 1px #4a4a4d;
  border-top: solid 1px #4a4a4d;
  display: flex;
  padding: 0 20px;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;

  .title {
    font-size: 12px;
    text-decoration: underline;
  }
`

const CloseButton = styled.button`
  border: none;
  background: transparent;
  margin-left: 10px;
  cursor: pointer;
  width: 16px;
  height: 16px;
  padding: 0;

  & svg {
    fill: #888888;
  }
  &:hover svg {
    fill: #666666;
  }
`

const ClearButton = styled.button`
  /* height: 16px; */
  padding: 3px 8px;
  border-radius: 4px;
  border: solid 1px #ffffff;
  background-color: transparent;
  color: white;
  margin-left: 8px;
  font-size: 12px;

  &:hover {
    background: #363636;
  }
`

export enum BottomView {
  NONE,
  ERRORS,
  CONSOLE,
}

interface BottomTitleBarProps {
  view: BottomView
  onSetView: (newView: BottomView) => void
}

const BottomTitleBar: React.FC<BottomTitleBarProps> = ({ view, onSetView }) => {
  const { clear: clearConsole } = useConsole()

  return (
    <Header size={30}>
      <div>
        <span className="title">{view === BottomView.ERRORS ? 'Errors' : 'Console'}</span>
        {view === BottomView.CONSOLE && <ClearButton onClick={clearConsole}>Clear</ClearButton>}
      </div>

      <CloseButton onClick={() => onSetView(BottomView.NONE)}>
        <CloseIcon />
      </CloseButton>
    </Header>
  )
}

export default BottomTitleBar
