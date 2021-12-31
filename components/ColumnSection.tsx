import React from 'react';
import styled from 'styled-components';

const ColumnContainer = styled.div<{ columns?: string, offset?: string }>`
  grid-column: span 12;

  @media ( min-width: 1200px ) {
    grid-column: span ${({columns})=>columns};

    ${({offset}) => offset ? `
      grid-column: ${offset} / -${offset};
    ` : ''}
  }

  
`

interface ColumnSectionProps {
  tag?: React.ElementType | "div"
  className?: string
  columns?: string
  offset?: string
}

const ColumnSection: React.FC<ColumnSectionProps> = ({ children, tag, className, columns, offset}) => {
  return (
   <ColumnContainer as={tag} className={className} columns={columns} offset={offset}>
      {children}
   </ColumnContainer>
  )
}

export default ColumnSection;