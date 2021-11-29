import React from 'react'
import styled from 'styled-components'
import ReactModal from 'react-modal'

const ModalOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  & .modal-content {
    border: solid 1px #444;
    border-radius: 5px;
    background: #ffffff;
    color: #000000;
    margin: 40px;
    max-width: 800px;
  }
`

const Header = styled.h1`
  font-size: 18px;
  font-weight: 600;
  padding: 8px;
`

const Content = styled.div`
  max-height: 70vh;
  padding: 10px 30px;
  overflow: auto;
`

ReactModal.setAppElement('#__next')

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
}

const EditorModal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
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

export default EditorModal;
