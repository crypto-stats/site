import styled from 'styled-components'

const Root = styled.span`
  color: #d3d3d3;
  font-size: 12px;
  display: inline-block;
`

interface InputLabelProps {
  children: React.ReactChild
}

export const InputLabel = (props: InputLabelProps) => {
  const { children } = props
  return <Root>{children}</Root>
}
