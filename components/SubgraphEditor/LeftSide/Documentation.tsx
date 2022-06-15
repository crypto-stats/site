import styled from 'styled-components'
import { ChevronLeft } from 'lucide-react'

const Root = styled.div`
  padding: 40px 32px;
  color: var(--color-white);
`

const Title = styled.h1`
  font-size: 30px;
  margin: 0px;
`

const BackLink = styled.a`
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  color: var(--color-white);
  text-decoration: none;

  &:hover {
    cursor: pointer;
  }
`

interface DocumentationProps {
  closeDocs: () => void
}

export const Documentation = (props: DocumentationProps) => {
  const { closeDocs } = props

  return (
    <Root>
      <BackLink onClick={closeDocs}>
        <ChevronLeft size={12} />
        Back to explorer
      </BackLink>
      <Title>Documentation</Title>
    </Root>
  )
}
