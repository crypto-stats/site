import React, { useState, Fragment } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { useAdapter } from 'hooks/local-adapters'
import PublishModal from './PublishModal'
import { info } from 'console'
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

const PublishButton = styled.button`
  height: 35px;
  margin: 0 0 0 32px;
  padding: 9px 20px;
  border-radius: 4px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
  color: white;
  background: #0477f4;
  border: none;
`

const IPFSLink = styled.a`
  color: #eee;
  font-size: 12px;
`

const ErrorChip = styled.div`
  background: #222222;
  border-radius: 4px;
  padding: 4px 8px;
  color: #7c8190;
  font-size: 12px;
  margin: 4px;
`

interface PrimaryFooterProps {
  fileName: string | null
  markers: any[]
}

const PrimaryFooter: React.FC<PrimaryFooterProps> = ({ fileName, markers }) => {
  const [showModal, setShowModal] = useState(false)
  const { adapter } = useAdapter(fileName)

  const lastPublication = adapter?.publications && adapter.publications.length > 0
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
        <ErrorChip>i: {infos.length}</ErrorChip>
        <ErrorChip>!: {warnings.length}</ErrorChip>
        <ErrorChip>x: {errors.length}</ErrorChip>
      </Side>

      <Side>
        {adapter && (
          <Fragment>
            {lastPublication && (
              <Link href={`/discover/adapter/${lastPublication.cid}`} passHref>
                <IPFSLink>
                  Last published to IPFS as {lastPublication.cid.substr(0,6)}...{lastPublication.cid.substr(-4)}
                  {' (v'}{lastPublication.version})
                </IPFSLink>
              </Link>
            )}

            <PublishButton onClick={() => setShowModal(true)}>Publish to IPFS</PublishButton>
          </Fragment>
        )}
      </Side>

      {fileName && (
        <PublishModal
          fileName={fileName}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </Container>
  );
}

export default PrimaryFooter;
