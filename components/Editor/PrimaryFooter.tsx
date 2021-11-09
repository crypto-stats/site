import React, { useState, Fragment } from 'react'
import Link from 'next/link'
import Modal from 'react-modal'
import styled from 'styled-components'
import { useAdapter } from 'hooks/local-adapters'
import Button from 'components/Button'

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

const ModalOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  & .modal-content {
    border: solid 1px #444;
    border-radius: 5px;
    background: #2f2f2f;
    color: #c8c8c8;
  }
`

const Header = styled.h1`
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  border-bottom: solid 1px #444;
  padding: 32px;
`

const Footer = styled.div`
  display: flex;
  border-top: solid 1px #444;
  padding: 10px 30px;
  justify-content: flex-end;
`

const IPFSLink = styled.a`
  color: #eee;
  font-size: 12px;
`

Modal.setAppElement('#__next');

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
        onRequestClose={() => setShowModal(false)}
        contentLabel="Publish to IPFS"
        className="modal-content"
        overlayElement={(props: any, contentElement: any) => (
          <ModalOverlay {...props}>{contentElement}</ModalOverlay>
        )}
      >
        {cid ? (
          <Fragment>
            <Header>Adapter Successfully Published!</Header>
            <div>
              <p>Your adapter has been published to IPFS! You may now share the following link:</p>
              <p>https://cryptostats.community/module/${cid}</p>
            </div>
            <Footer>
              <Button onClick={() => {
                setShowModal(false)
                setCID(null)
              }}>
                Return to Editor
              </Button>
            </Footer>
          </Fragment>
        ) : (
          <Fragment>
            <Header>Publish Your Adapter on IPFS</Header>
            <div>
              <p>Publish your adapter to IPFS to make it viewable by the community.</p>
              <p>Once your adapter is published, you may post it on the CryptoStats forum to request inclusion.</p>
            </div>
            <Footer>
              <Button onClick={() => setShowModal(false)}>Return to Editor</Button>
              <Button onClick={publish} disabled={publishing}>Publish</Button>
            </Footer>
          </Fragment>
        )}
      </Modal>
    </Container>
  );
}

export default PrimaryFooter;
