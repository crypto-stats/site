import React from 'react'
import styled from 'styled-components'
import ReactModal from 'react-modal'
import Button from './Button'

const ModalOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  & .modal-content {
    border: solid 1px #444;
    border-radius: 5px;
    background: #2f2f2f;
    color: #c8c8c8;
    margin: 40px;
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

const Content = styled.div`
  max-height: 70vh;
  padding: 10px 30px;
`

ReactModal.setAppElement('#__next')

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  buttons: { label: string, onClick: () => void, disabled?: boolean }[]
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, buttons, children }) => {
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

      <Footer>
        {buttons.map(button => (
          <Button onClick={button.onClick} disabled={button.disabled}>{button.label}</Button>
        ))}
      </Footer>
    </ReactModal>
  )
}

export default Modal;
