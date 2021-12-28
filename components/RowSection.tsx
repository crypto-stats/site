import React from 'react';
import styled from 'styled-components';

const Row = styled.section<{fullWidth?: boolean}>`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 10px 32px;
  width: 100%;
  background-color: transparent;
  box-shadow: none;
  margin: 0 auto;
  ${({fullWidth})=> fullWidth ? `width:100%;` : `width: calc(100% - 16px);

  @media(min-width: 768px) {
    max-width: calc(768px - 24px);
  }

  @media(min-width: 992px) {
    max-width: calc(992px - 24px);
  }

  @media(min-width: 1200px) {
    max-width: calc(1200px - 24px);
  }

  @media(min-width: 1400px) {
    max-width: 1280px;
  }` }
`

interface RowSectionProps {
  fullWidth?: boolean
  className?: string
}

const RowSection: React.FC<RowSectionProps> = ({ children, className, fullWidth }) => {
  return (
   <Row className={className} fullWidth={fullWidth}>
      {children}
   </Row>
  )
}

export default RowSection;