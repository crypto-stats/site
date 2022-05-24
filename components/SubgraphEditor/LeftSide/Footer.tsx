import styled from 'styled-components'

import { Separator } from './styled'

const Root = styled.div`
  padding: 32px;
`

const DocumentationLink = styled.a`
  font-size: 14px;
  color: var(--color-white);
  text-decoration: none;
`

export const Footer = () => {
  return (
    <>
      <Separator />
      <Root>
        <DocumentationLink href="#" className="main-title">
          Help & Documentation
        </DocumentationLink>
      </Root>
    </>
  )
}
