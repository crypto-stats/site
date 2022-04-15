import React from 'react'
import styled from 'styled-components'

const NotificationBarContainer = styled.section`
  background-color: var(--color-primary-200);
  padding: var(--spaces-3) 0;
  display: flex;
  justify-content: center;
`

const NotificationBarInner = styled.section`
  width: 100%;
  max-width: var(--container-fixed);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0 var(--spaces-4);

  @media (min-width: 1200px) {
    padding: 0;
  }
`

interface NotificationBarProps {
  className?: string
}

const NotificationBar: React.FC<NotificationBarProps> = ({ children, className }) => {
  return (
    <NotificationBarContainer className={className}>
      <NotificationBarInner>{children}</NotificationBarInner>
    </NotificationBarContainer>
  )
}

export default NotificationBar
