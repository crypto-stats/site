import React from 'react'
import styled from 'styled-components'
import { XOctagon, AlertTriangle, Info } from 'lucide-react'

import { MarkerSeverity } from './types'

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
`

const Side = styled.div`
  display: flex;
  align-items: center;
`

const ErrorChip = styled.button<{ color?: string }>`
  background: #222222;
  border-radius: 4px;
  padding: 4px 8px;
  color: ${({ color }) => color || '#7c8190'};
  font-size: 12px;
  margin: 4px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background: #191919;
  }

  svg {
    margin-right: 4px;
  }
`

interface PrimaryFooterProps {
  markers: any[]
  onMarkerClick: () => void
  onConsoleClick: () => void
}

const PrimaryFooter: React.FC<PrimaryFooterProps> = ({
  markers,
  onMarkerClick,
  onConsoleClick,
}) => {
  const infos = []
  const warnings = []
  const errors = []

  for (const marker of markers) {
    if (marker.severity === MarkerSeverity.Error) {
      errors.push(marker)
    } else if (marker.severity === MarkerSeverity.Warning) {
      warnings.push(marker)
    } else {
      infos.push(marker)
    }
  }

  return (
    <Container>
      <Side>
        <ErrorChip onClick={onMarkerClick} color={infos.length > 0 ? '#cccccc' : undefined}>
          <Info size={12} /> {infos.length}
        </ErrorChip>
        <ErrorChip onClick={onMarkerClick} color={warnings.length > 0 ? 'yellow' : undefined}>
          <AlertTriangle size={12} /> {warnings.length}
        </ErrorChip>
        <ErrorChip onClick={onMarkerClick} color={errors.length > 0 ? 'red' : undefined}>
          <XOctagon size={12} /> {errors.length}
        </ErrorChip>
        <ErrorChip onClick={onConsoleClick}>Console</ErrorChip>
      </Side>
    </Container>
  )
}

export default PrimaryFooter
