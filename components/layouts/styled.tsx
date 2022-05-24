import { Top } from 'react-spaces'
import styled from 'styled-components'

export const Header = styled(Top)`
  background-image: url('/editor_logo.png');
  background-size: 140px;
  background-color: #2f2f2f;
  background-position: center;
  background-repeat: no-repeat;
  border-bottom: solid 1px #4a4a4d;
  display: flex;
  justify-content: space-between;
  padding: 0px 24px;
`
export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  @media (max-width: 700px) {
    display: none;
  }
`

export const SubgraphHeader = styled(Top)`
  background-color: #0f1012;
  display: flex;
  justify-content: space-between;
  padding: 0px 8px;
  margin-left: 298px;
`
