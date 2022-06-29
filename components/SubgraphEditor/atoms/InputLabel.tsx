import styled from 'styled-components'

const Root = styled.span`
  color: #d3d3d3;
  font-size: 12px;
  display: inline-block;
`

export const InputLabel: React.FC = ({ children }) => {
  return <Root>{children}</Root>
}
