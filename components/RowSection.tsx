import React from 'react';
import styled from 'styled-components';

const Row = styled.section<{fullWidth?: boolean}>`
  display: grid;
  grid-template-columns: repeat(var(--grid-columns), 1fr);
  grid-gap: var(--grid-row-gap) var(--grid-column-gap);
  background-color: transparent;
  box-shadow: none;
  margin: 0 auto;
  
  ${({fullWidth}) => fullWidth ? `
    width: var(--container-full);
    ` : `

    width: calc( var(--container-full) - var(--spaces-4) );

    @media ( min-width: 768px ) {
      max-width: calc( var(--bp-small) - var(--spaces-4) );
    }

    @media ( min-width: 992px ) {
      max-width: calc( var(--bp-medium) - var(--spaces-4) );
    }

    @media ( min-width: 1200px ){
      max-width: calc( var(--bp-large) - var(--spaces-4) );
    }

    @media ( min-width: 1400px ){
      max-width: var(--container-fixed);
    }
  `}
`

interface RowSectionProps {
  fullWidth?: boolean | false
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