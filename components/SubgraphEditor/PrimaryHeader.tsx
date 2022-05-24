import { useState } from 'react'
import styled from 'styled-components'

import { useLocalSubgraph } from 'hooks/local-subgraphs'
import { HeaderRight, SubgraphHeader, WalletButton } from 'components/layouts'
import Button from 'components/Button'
import { MarkerSeverity } from './types'
import PublishModal from './PublishModal'

const SubgraphTitle = styled.h2`
  font-size: 22px;
  color: #d3d3d3;
  margin: 24px 8px;
`

const PublishButton = styled(Button)`
  height: 35px;
  margin: 0 16px;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
  font-weight: normal;
  position: relative;
  text-transform: uppercase;
  min-width: 120px;

  &:disabled:hover:before {
    content: 'Fix all errors to allow publishing';
    display: block;
    position: absolute;
    z-index: 100;
    left: 0;
    transform: translateX(-140px);
    top: 0;
    bottom: 0;
    background: #222222;
    padding: 2px;
    font-size: 12px;
    border-radius: 4px;
    color: #cccccc;
  }
`

interface PrimaryHeaderProps {
  filename: string | null
  markers: any[]
  editorRef: any
}

export const PrimaryHeader = (props: PrimaryHeaderProps) => {
  const { filename, markers, editorRef } = props
  const [showModal, setShowModal] = useState(false)
  const { subgraph } = useLocalSubgraph(filename)

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
    <SubgraphHeader size={80} order={1}>
      <SubgraphTitle>{subgraph?.name}</SubgraphTitle>
      <HeaderRight>
        <WalletButton />
        {subgraph && (
          <PublishButton
            onClick={() => setShowModal(true)}
            disabled={errors.length > 0}
            className="primary">
            Publish
          </PublishButton>
        )}
      </HeaderRight>

      {filename && (
        <PublishModal
          fileName={filename}
          show={showModal}
          onClose={() => setShowModal(false)}
          editorRef={editorRef}
        />
      )}
    </SubgraphHeader>
  )
}
