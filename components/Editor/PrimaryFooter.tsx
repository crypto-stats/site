import React, { useState, Fragment } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { useAdapter } from 'hooks/local-adapters'
import Modal from 'components/Modal'

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
  const [publishing, setPublishing] = useState(false)
  const [cid, setCID] = useState<null | string>(null)
  const [showModal, setShowModal] = useState(false)
  const { publish: publishToIPFS, adapter } = useAdapter(fileName)

  const publish = async () => {
    setPublishing(true)
    try {
      const { codeCID } = await publishToIPFS(adapter.code, adapter.name)
      setCID(codeCID)
    } catch (e) {
      console.warn(e)
    }
    setPublishing(false)
  }

  return (
    <Container>
      <Side />
      <Side>
        {adapter && (
          <Fragment>
            {adapter.cid && (
              <Link href={`/module/${adapter.cid}`} passHref>
                <IPFSLink>
                  Last published to IPFS as {adapter.cid.substr(0,6)}...{adapter.cid.substr(-4)}
                </IPFSLink>
              </Link>
            )}

            <PublishButton onClick={() => setShowModal(true)}>Publish to IPFS</PublishButton>
          </Fragment>
        )}
      </Side>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={cid ? 'Adapter Successfully Published!' : 'Publish Your Adapter on IPFS'}
        buttons={cid
          ? [{ label: 'Return to Editor', onClick: () => {
            setShowModal(false)
            setCID(null)
          } }]
          : [
            { label: 'Return to Editor', onClick: () => setShowModal(false) },
            { label: 'Publish', onClick: publish, disabled: publishing },
          ]
        }
      >
        {cid ? (
          <div>
            <p>Your adapter has been published to IPFS! You may now share the following link:</p>
            <p>https://cryptostats.community/module/${cid}</p>
          </div>
        ) : (
          <div>
            <p>Publish your adapter to IPFS to make it viewable by the community.</p>
            <p>Once your adapter is published, you may post it on the CryptoStats forum to request inclusion.</p>
          </div>
        )}
      </Modal>
    </Container>
  );
}

export default PrimaryFooter;
