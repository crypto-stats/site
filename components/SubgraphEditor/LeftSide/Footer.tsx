import styled from 'styled-components'

import { Separator } from './styled'

const Root = styled.div`
  padding: 32px;
`

const DocumentationLink = styled.a`
  font-size: 14px;
  color: var(--color-white);
  text-decoration: none;

  &:hover {
    cursor: pointer;
  }
`

interface FooterProps {
  onDocsClick: () => void
}

export const Footer = (props: FooterProps) => {
  const { onDocsClick } = props

  return (
    <>
      <Separator />
      <Root>
        <DocumentationLink href="#" className="main-title" onClick={onDocsClick}>
          Help & Documentation
        </DocumentationLink>
      </Root>
    </>
  )
}
