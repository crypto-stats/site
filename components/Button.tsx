import React from 'react';
import styled from 'styled-components';

const ButtonElement = styled.button`
  border-radius: 0;
  background: #58a8fd;
  border: none;
  padding: 4px 8px;
  font-size: 14px;

  &:hover {
    background: #3a98fd;
  }
}
`

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, disabled }) => {
  return (
    <ButtonElement onClick={onClick} disabled={disabled}>
      {children}
    </ButtonElement>
  )
}

export default Button;
