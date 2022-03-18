import React from "react"
import styled from "styled-components"
import { Top } from "react-spaces"
import CloseIcon from "components/CloseIcon"
import { useConsole } from "hooks/console"

const Header = styled(Top)`
  background: #2f2f2f;
  border-bottom: solid 1px #4a4a4d;
  border-top: solid 1px #4a4a4d;
  display: flex;
  padding: 0 4px;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
`

const CloseButton = styled.button`
  border: none;
  background: transparent;
  margin-left: 10px;
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

const ClearButton = styled.button`
  height: 20px;
  padding: 3px 0 2px;
  border-radius: 4px;
  border: solid 1px #ffffff;
  background-color: transparent;
  margin: 16px 0 6px;
  color: white;
  padding: 2px 16px;
  margin-left: 8px;

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
    <Header size={40}>
      <div>
        {view === BottomView.ERRORS ? "Errors" : "Console"}
        {view === BottomView.CONSOLE && <ClearButton onClick={clearConsole}>Clear</ClearButton>}
      </div>

      <CloseButton onClick={() => onSetView(BottomView.NONE)}>
        <CloseIcon />
      </CloseButton>
    </Header>
  )
}

export default BottomTitleBar
