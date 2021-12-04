import React from 'react';
import styled from 'styled-components';

const ButtonElement = styled.button`
  border-radius: 0;
  background: #0477f4;
  border: none;
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 4px;
  color: white;

  &:hover {
    background: #3a98fd;
  }
  &:disabled: {
    background: #999;
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
