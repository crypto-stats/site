import React from 'react'
import styled from 'styled-components'
import ReactModal from 'react-modal'
import ButtonComponent from '../Button'
import { ChevronLeft, X } from 'react-feather'

const ModalOverlay = styled.div<{ width?: string | number; height?: string | number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent !important;
  
  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7) !important;
    backdrop-filter: blur(4px);
    z-index: 1;
  }

  & .modal-content {
    z-index: 2;
    border: solid 1px #444;
    border-radius: 4px;
    background-color: #2f2f2f;
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
  text-align: center;
`

const Footer = styled.div`
  display: flex;
  border-top: solid 1px #444;
  padding: 24px 30px;
  justify-content: space-between;
`

const Content = styled.div`
  max-height: 70vh;
  padding: 32px;
  overflow: auto;
  flex: 1;
`

const HeaderSide = styled.div<{ side: string }>`
  width: 32px;
  float: ${({ side }) => side};
  text-align: ${({ side }) => side};
`

const HeaderButton = styled.button`
  background: none;
  border: none;
  color: #cccccc;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: #444444;
  }
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
  onBack?: null | (() => void)
}

const EditorModal: React.FC<ModalProps> = ({ isOpen, onClose, title, buttons, children, width, height, onBack }) => {
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
      <Header>
        <HeaderSide side="left">
          {onBack && <HeaderButton onClick={onBack}><ChevronLeft />Back</HeaderButton>}
        </HeaderSide>

        {title}

        <HeaderSide side="right">
          <HeaderButton onClick={onClose}><X /></HeaderButton>
        </HeaderSide>
      </Header>

      <Content>{children}</Content>

      <Footer>
        {buttons.map(button => (
          <ButtonComponent
            key={button.label}
            onClick={button.onClick}
            disabled={button.disabled}
            variant={button.label === "Return to Editor" ? 'outline' : 'primary'}
          >
            {button.label}
          </ButtonComponent>
        ))}
      </Footer>
    </ReactModal>
  )
}

export default EditorModal
