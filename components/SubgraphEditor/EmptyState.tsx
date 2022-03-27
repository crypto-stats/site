import React from 'react'
import styled from 'styled-components'

const OuterContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  color: #ffffff;
  margin: 20px;
  max-width: 400px;
  text-align: center;
`

const GM = styled.h3`
  font-size: 24px;
  font-weight: bold;
`

const P = styled.p<{ bold?: boolean }>`
  font-size: 18px;
  ${({ bold }) => bold && 'font-weight: bold;'}
`

const Button = styled.button`
  border: solid 1px #0477f4;
  border-radius: 4px;
  color: #0477f4;
  font-size: 14px;
  font-weight: 500;
  background: transparent;
  height: 36px;

  &:hover {
    background: #011932;
  }
`

interface EmptyStateProps {
  onCreate: () => void
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreate }) => {
  return (
    <OuterContainer>
      <Container>
        <GM>Gm</GM>

        <P>Create, test, and publish CryptoStats adapters. All from your browser!</P>

        <P bold>Let's get started!</P>

        <Button onClick={onCreate}>Create new adapter</Button>
      </Container>
    </OuterContainer>
  )
}

export default EmptyState
