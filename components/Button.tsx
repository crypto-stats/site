import React from 'react';
import styled from 'styled-components';

const ButtonElement = styled.button<{ type: string }>`
  border: none;
  border-radius: 4px;
  box-shadow: none;
  background: none;
  cursor: pointer;
  outline: none;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  padding: 8px 32px;
  letter-spacing: 0.2px;
  

  ${({type}) => type === "outline" ?  `
      background-color: transparent;
      color: #0477F4;
      border: 1px solid #0477F4;

      &:hover {
        background-color: #0477F4;
        color: #FFF;
      }
    `
    :
    `
      background-color: #0477F4;
      color: #FFF;
    `
  }
`

interface ButtonProps {
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: string
}

const Button: React.FC<ButtonProps> = ({ children, onClick, disabled, className, type }) => {
  return (
    <ButtonElement type={type} onClick={onClick} disabled={disabled} className={className}>
      {children}
    </ButtonElement>
  )
}

export default Button;
