import CloseIcon from 'components/CloseIcon'
import React from 'react'
import { Fill, Top } from 'react-spaces'
import styled from 'styled-components'

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

const MarkerList = styled.ul`
  color: #c8c8c8;
  padding: 0;
  margin: 0;
`

const MarkerRow = styled.li`
  list-style: none;
  display: flex;
  align-items: center;
  padding: 4px;
  border-bottom: solid 1px #333333;
  height: 30px;
  font-size: 14px;
`

const Line = styled.span`
  color: #999999;
  padding-right: 4px;
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

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #c8c8c8;
`

interface ErrorPanelProps {
  markers: any[]
  onClose: () => void
}

const ErrorPanel: React.FC<ErrorPanelProps> = ({ markers, onClose }) => {
  return (
    <Fill>
      <Header size={40}>
        Errors
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
      </Header>
      <Fill>
        {markers.length > 0 ? (
          <MarkerList>
            {markers.map(marker => (
              <MarkerRow key={`${marker.startLineNumber}-${marker.startColumn}-${marker.code}`}>
                <Line>[{marker.startLineNumber}:{marker.startColumn}]</Line>
                {marker.message}
              </MarkerRow>
            ))}
          </MarkerList>
        ) : (
          <EmptyState>No Errors</EmptyState>
        )}
      </Fill>
    </Fill>
  )
}

export default ErrorPanel
