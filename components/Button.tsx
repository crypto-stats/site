import React from 'react';
import styled from 'styled-components';
import { Edit } from 'react-feather'

const ForkIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
    <path d="M8 7C9.10457 7 10 6.10457 10 5C10 3.89543 9.10457 3 8 3C6.89543 3 6 3.89543 6 5C6 6.10457 6.89543 7 8 7Z" />
    <path d="M8 21C9.10457 21 10 20.1046 10 19C10 17.8954 9.10457 17 8 17C6.89543 17 6 17.8954 6 19C6 20.1046 6.89543 21 8 21Z" />
    <path d="M17 10C18.1046 10 19 9.10457 19 8C19 6.89543 18.1046 6 17 6C15.8954 6 15 6.89543 15 8C15 9.10457 15.8954 10 17 10Z" />
    <path d="M8 7V17" />
    <path d="M17 11V12.8C17 13.1183 16.7893 13.4235 16.4142 13.6485C16.0391 13.8736 15.5304 14 15 14H8"/>
  </svg>
)

const ButtonElement = styled.button<{ className?: string }>`
  display: flex;
  width: 100%;
  min-width: 160px;
  border: none;
  border-radius: 4px;
  box-shadow: none;
  background: none;
  cursor: pointer;
  outline: none;
  padding: 8px;
  justify-content: center;
  align-items: center;

  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.2px;
  line-height: 17px;
  transition: 150ms ease;

  &:hover {
    background-color: var(--color-primary);
    color: var(--color-white) !important;
  }
  

  ${({className}) => className === "outline" &&  `
      background-color: transparent;
      color: var(--color-primary);
      border: 1px solid var(--color-primary);

      &:hover {
        background-color: var(--color-primary);
        color: var(--color-white);
      }
  `}
  ${({className}) => className === "secondary" &&  `
      background-color: var(--color-primary-200);
      color: #0477F4;
      border: 1px solid transparent;

      &:hover {
        background-color: #0477F4;
        color: #FFF;
      }
  `}
`

const Icon = styled.i`
  width: var(--spaces-3);
  height: var(--spaces-3);
  display: inline-block;
  margin-right: var(--spaces-2);
`

interface ButtonProps {
  onClick?: () => void
  disabled?: boolean
  className?: string
  icon?: string
}

const Button: React.FC<ButtonProps> = ({ children, onClick, disabled, className, icon}) => {

  let svgIcon;

  if(icon) {
    switch (icon) {
      case "Edit" :
        svgIcon = <Edit size="16" />
      break;
      case "Fork" :
        svgIcon = <ForkIcon />
      break;
    }
  }
    
  return (
    <ButtonElement onClick={onClick} disabled={disabled} className={className}>
      {icon &&   
        <Icon>
          {svgIcon}
        </Icon>
      }
      <span>{children}</span>
    </ButtonElement>
  )
}

Button.defaultProps = {
  className: "primary"
}

export default Button;