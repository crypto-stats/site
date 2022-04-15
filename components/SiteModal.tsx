import React from 'react'
import styled from 'styled-components'
import ReactModal from 'react-modal'

const ModalOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  & .modal-content {
    background: #ffffff;
    border: 1px solid #dddddd;
    box-shadow: 0 8px 10px 0 rgba(0, 0, 0, 0.12);
    border-radius: 6px;
    margin: 40px 40px 0;
    max-width: 800px;
  }
`

const Header = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  padding: 32px 40px;
  border-bottom: 1px solid #ddd;
`

const Content = styled.div`
  max-height: 70vh;
  overflow: auto;
  padding: 32px 0;
  display: flex;
  flex-direction: column;
`

ReactModal.setAppElement('#__next')

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
}

const SiteModal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={title}
      className="modal-content"
      overlayElement={(props: any, contentElement: any) => (
        <ModalOverlay {...props}>{contentElement}</ModalOverlay>
      )}
    >
      <Header>{title}</Header>
      <Content>{children}</Content>
    </ReactModal>
  )
}

export default SiteModal
