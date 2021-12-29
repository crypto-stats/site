import React from 'react';
import styled from 'styled-components';

const ColumnContainer = styled.div<{ columns?: string }>`
  grid-column: span 12;

  @media ( min-width: 1200px ) {
    grid-column: span ${({columns})=>columns};
  }
`

interface ColumnSectionProps {
  tag?: React.ElementType | "div"
  className?: string
  columns?: string
}

const ColumnSection: React.FC<ColumnSectionProps> = ({ children, tag, className, columns}) => {
  return (
   <ColumnContainer as={tag} className={className} columns={columns}>
      {children}
   </ColumnContainer>
  )
}

export default ColumnSection;