import React from 'react';
import styled from 'styled-components';

const Container = styled.section`
  width: 100%;
  background-color: transparent;
  box-shadow: none;
`

interface ContainerSectionProps {
  className?: string
}

const ContainerSection: React.FC<ContainerSectionProps> = ({ children, className}) => {
  return (
   <Container className={className}>
      {children}
   </Container>
  )
}

export default ContainerSection;