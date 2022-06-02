import React from 'react'
import styled from 'styled-components'
import ReactModal from 'react-modal'
import ButtonComponent from '../Button'

const ModalOverlay = styled.div<{ width?: string | number; height?: string | number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent !important;
  backdrop-filter: blur(10px);

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7) !important;
    backdrop-filter: blur(4px);
    z-index: 1;
  }

  & .modal-content {
    font-family: Manrope;
    z-index: 2;
    border: 1px solid #606060;
    border-radius: 8px;
    background-color: #2f3237;
    color: #c8c8c8;
    padding: 24px 32px;
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
  font-size: 36px;
  font-weight: 600;
  margin: 0;
`

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`

const Content = styled.div`
  max-height: 70vh;
  overflow: auto;
  flex: 1;
  padding: 32px 0px;
`

ReactModal.setAppElement('#__next')

export interface Button {
  label: string
  onClick: () => void
  disabled?: boolean
}

interface ModalProps {
  isOpen: boolean
  onClose?: () => void
  title: string
  buttons: Button[]
  width?: string
  height?: string
  onBack?: null | (() => void)
}

const EditorModal: React.FC<ModalProps> = props => {
  const { isOpen, onClose, title, buttons, children, width, height } = props
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={title}
      className="modal-content"
      overlayElement={(props: any, contentElement: any) => (
        <ModalOverlay width={width} height={height} {...props}>
          {contentElement}
        </ModalOverlay>
      )}>
      <Header>{title}</Header>

      <Content>{children}</Content>

      <Footer>
        {buttons.map(button => (
          <ButtonComponent
            key={button.label}
            onClick={button.onClick}
            disabled={button.disabled}
            variant={['Cancel', 'Close'].includes(button.label) ? 'outline' : 'primary'}>
            {button.label}
          </ButtonComponent>
        ))}
      </Footer>
    </ReactModal>
  )
}

export default EditorModal
