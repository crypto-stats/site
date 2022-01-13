import React from 'react'
import { Fill } from 'react-spaces'
import styled from 'styled-components'

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

const ErrorPanel: React.FC<ErrorPanelProps> = ({ markers }) => {
  return (
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
  )
}

export default ErrorPanel
