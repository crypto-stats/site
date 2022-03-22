import styled from 'styled-components'

export type Position = 'BottomLeft' | 'Center' | 'TopRight' | 'TopLeft' | 'BottomRight'

export const Positionable = styled.div<{ position?: Position }>`
  ${({ position }) => (position ? 'position: absolute;' : '')}

  ${({ position }) =>
    position === 'BottomLeft'
      ? `
    bottom: 0;
    left: 0;
  `
      : position === 'TopRight'
      ? `
    top: 0;
    right: 0;
  `
      : position === 'TopLeft'
      ? `
    top: 0;
    left: 0;
  `
      : position === 'BottomRight'
      ? `
    bottom: 0;
    right: 0;
  `
      : position === 'Center'
      ? `
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `
      : ''}
`
