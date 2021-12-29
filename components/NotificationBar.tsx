import React from 'react';
import styled from 'styled-components';

const NotificationBarContainer = styled.section`
  background-color: #d6eaff;
  height: 60px;
  display: flex;
  justify-content: center;
`

const NotificationBarInner = styled.section`
  max-width: 1248px;
  width: 100vw;
  display: flex;
  flex-direction: column;
  padding: 0 6px;
  box-sizing: border-box;
`

interface NotificationBarProps {
  className?: string
}

const NotificationBar: React.FC<NotificationBarProps> = ({ children, className}) => {
  return (
    <NotificationBarContainer className={className}>
      <NotificationBarInner>
        {children}
      </NotificationBarInner>
    </NotificationBarContainer>
  )
}

export default NotificationBar;