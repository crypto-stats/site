import React, { useState, Fragment } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { useAdapter } from 'hooks/local-adapters'
import PublishModal from './PublishModal'

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

interface PrimaryFooterProps {
  fileName: string | null
}

const PrimaryFooter: React.FC<PrimaryFooterProps> = ({ fileName }) => {
  const [showModal, setShowModal] = useState(false)
  const { adapter } = useAdapter(fileName)

  const lastPublication = adapter?.publications && adapter.publications.length > 0
    ? adapter!.publications[adapter!.publications.length - 1]
    : null

  return (
    <Container>
      <Side />
      <Side>
        {adapter && (
          <Fragment>
            {lastPublication && (
              <Link href={`/module/${lastPublication.cid}`} passHref>
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
