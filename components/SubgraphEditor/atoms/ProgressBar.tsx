import styled, { keyframes } from 'styled-components'

const leftToRightAnimation = keyframes`
 0% { left: 0; }
 25% { left: 25% }
 50% { left: 50% }
 50% { left: 50% }
 75% { left: 75% }
 100% { left: calc(100% - 38px) }
`

const Root = styled.div<{ $active?: boolean; $completed?: boolean }>`
  position: relative;
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ $active, $completed }) => {
    if ($active) {
      return '#bdd0f6'
    } else if ($completed) {
      return 'var(--color-primary)'
    } else {
      return '#d8d8d8'
    }
  }};

  > span {
    background-color: var(--color-primary);
    width: 40px;
    height: 8px;
    border-radius: 4px;
    position: absolute;
    animation: linear infinite;
    animation-name: ${leftToRightAnimation};
    animation-duration: 1s;
  }
`

interface ProgressBarProps {
  active?: boolean
  completed?: boolean
}

export const ProgressBar = (props: ProgressBarProps) => {
  const { active, completed } = props

  return (
    <Root $active={active} $completed={completed}>
      {active ? <span /> : null}
    </Root>
  )
}
