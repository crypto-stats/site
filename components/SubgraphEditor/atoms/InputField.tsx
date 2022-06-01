import styled from 'styled-components'

import InputFieldMain from 'components/InputField'

export const InputField = styled(InputFieldMain)`
  width: 100%;
  color: #b0b0b0;
  background-color: #2a2d30;
  border: solid 1px #181818;
  box-sizing: border-box;
  padding: 10px;
  padding-right: 55px;
  border-radius: 4px;
  margin: 4px 0;
  font-size: 14px;

  &:focus-visible {
    outline: 0;
    border-color: #2684ff;
  }
`
