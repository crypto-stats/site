import React, { useState, Fragment } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { XOctagon, AlertTriangle, Info } from 'react-feather'
import { useAdapter } from 'hooks/local-adapters'
import PublishModal from './PublishModal'
import { MarkerSeverity } from './types'
import Button from 'components/Button'
import PublishSubgraphModal from './PublishSubgraphModal'

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
`

const Side = styled.div`
  display: flex;
  align-items: center;
`

const PublishButton = styled(Button)`
  height: 35px;
  margin: 0 16px 0 32px;
  padding: 9px 20px;
  border-radius: 4px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
  font-weight: normal;
  position: relative;

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

const IPFSLink = styled.a`
  color: #eee;
  font-size: 12px;
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
  fileName: string | null
  markers: any[]
  onMarkerClick: () => void
  onConsoleClick: () => void
  editorRef: any
  isSubgraph: boolean
}

const PrimaryFooter: React.FC<PrimaryFooterProps> = ({
  fileName,
  markers,
  onMarkerClick,
  onConsoleClick,
  isSubgraph,
  editorRef,
}) => {
  const [showModal, setShowModal] = useState(false)
  const { adapter } = useAdapter(fileName)

  const lastPublication =
    adapter?.publications && adapter.publications.length > 0
      ? adapter!.publications[adapter!.publications.length - 1]
      : null

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

      <Side>
        {adapter && (
          <Fragment>
            {lastPublication && (
              <Link href={`/discover/adapter/${lastPublication.cid}`} passHref>
                <IPFSLink>
                  Last published to IPFS as {lastPublication.cid.substr(0, 6)}...
                  {lastPublication.cid.substr(-4)}
                  {' (v'}
                  {lastPublication.version})
                </IPFSLink>
              </Link>
            )}

            <PublishButton
              onClick={() => setShowModal(true)}
              disabled={isSubgraph && errors.length > 0}
              className={'primary'}
            >
              Publish {isSubgraph ? 'subgraph' : 'to IPFS'}
            </PublishButton>
          </Fragment>
        )}
      </Side>

      {fileName &&
        (isSubgraph ? (
          <PublishSubgraphModal
            fileName={fileName}
            show={showModal}
            onClose={() => setShowModal(false)}
          />
        ) : (
          <PublishModal
            fileName={fileName}
            show={showModal}
            onClose={() => setShowModal(false)}
            editorRef={editorRef}
          />
        ))}
    </Container>
  )
}

export default PrimaryFooter
