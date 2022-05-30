import styled from 'styled-components'

import { Separator } from './styled'

const Root = styled.div`
  padding: 24px 32px;

  > .main-title {
    color: var(--color-white);
    font-size: 16px;
    margin: 0px;
    margin-bottom: 4px;
    text-transform: uppercase;
  }

  > .subtitle {
    font-size: 10px;
    color: #949494;
    margin: 0px;
  }
`

export const Title = () => {
  return (
    <>
      <Root>
        <h1 className="main-title">The Subeditor</h1>
        <h4 className="subtitle">by CRYPTOSTATS</h4>
      </Root>
      <Separator />
    </>
  )
}
