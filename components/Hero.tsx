import React from 'react'
import styled from 'styled-components'

const HeroContainer = styled.section<{ align?: string }>`
  width: 100%;
  text-align: ${({align})=>align};
`

interface HeroProps {
  className?: string
  align?: string | "left"
}

const Hero: React.FC<HeroProps> = ({ children, className, align }) => {
  return (
    <HeroContainer className={className} align={align}>
      {children}
    </HeroContainer>
  )
}

export default Hero
