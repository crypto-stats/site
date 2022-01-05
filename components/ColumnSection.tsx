import React from 'react';
import styled from 'styled-components';

const ColumnContainer = styled.div<{ columns?: string, offset?: string, from?: string, to?: string, hideSmall?: boolean}>`
  position: relative;
  grid-column: span 12;

  ${({hideSmall}) => hideSmall && `display: none;`}

  @media ( min-width: 1024px ) {
    
    ${({hideSmall}) => hideSmall && `display: block;`}

    grid-column: span ${({columns})=>columns};

    ${({offset}) => offset ? `
      grid-column: ${offset} / -${offset};
    ` : ''}

    ${({from, to}) => from && to ? `
      grid-column: ${from} / ${to};
    ` : ''}
  }
`

interface ColumnSectionProps {
  tag?: React.ElementType | "div"
  className?: string
  columns?: string
  offset?: string
  from?: string
  to?: string
  hideSmall?: boolean
}

const ColumnSection: React.FC<ColumnSectionProps> = ({ children, tag, className, columns, offset, from, to, hideSmall}) => {
  return (
   <ColumnContainer as={tag} className={className} columns={columns} offset={offset} from={from} to={to} hideSmall={hideSmall}>
      {children}
   </ColumnContainer>
  )
}

export default ColumnSection;