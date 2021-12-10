import React from 'react'
import styled from 'styled-components'
import ReactModal from 'react-modal'
import ButtonComponent from '../Button'

const ModalOverlay = styled.div<{ width?: string | number; height?: string | number }>`
  display: flex;
  align-items: center;
  justify-content: center;

  & .modal-content {
    border: solid 1px #444;
    border-radius: 5px;
    background: #2f2f2f;
    color: #c8c8c8;
    margin: 40px;
    display: flex;
    flex-direction: column;
    ${({ width, height }) => `
      ${width ? `width: ${width};` : ''}
      ${height ? `height: ${height};` : ''}
    `}
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
  overflow: auto;
  flex: 1;
`

ReactModal.setAppElement('#__next')

export interface Button {
  label: string
  onClick: () => void
  disabled?: boolean
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  buttons: Button[]
  width?: string
  height?: string
}

const EditorModal: React.FC<ModalProps> = ({ isOpen, onClose, title, buttons, children, width, height }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={title}
      className="modal-content"
      overlayElement={(props: any, contentElement: any) => (
        <ModalOverlay width={width} height={height} {...props}>{contentElement}</ModalOverlay>
      )}
    >
      <Header>{title}</Header>

      <Content>{children}</Content>

      <Footer>
        {buttons.map(button => (
          <ButtonComponent
            key={button.label}
            onClick={button.onClick}
            disabled={button.disabled}
          >
            {button.label}
          </ButtonComponent>
        ))}
      </Footer>
    </ReactModal>
  )
}

export default EditorModal
