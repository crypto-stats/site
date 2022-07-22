import React from 'react'
import styled from 'styled-components'

const Root = styled.div`
  max-width: 600px;
  padding: 40px;
  height: 100%;
  color: var(--color-white);
  font-size: 14px;
  display: flex;
  flex-direction: column;

  > .title {
    font-size: 36px;
    margin: 30px 0px;
    font-weight: normal;
  }
`

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 80px 0px 50px 0px;

  > .sub-section {
    display: flex;
    flex-direction: column;

    > h3 {
      font-weight: bold;
      margin: 0px;
      margin-bottom: 12px;
      font-size: 20px;
    }

    > a {
      color: var(--color-primary);
      font-weight: bold;
      text-decoration: none;
    }
  }
`

interface EmptyStateProps {
  setShowDocs: React.Dispatch<React.SetStateAction<boolean>>
}

export const EmptyState = (props: EmptyStateProps) => {
  const { setShowDocs } = props
  return (
    <Root>
      <h2 className="title">Welcome to the Subeditor</h2>
      <span>Start by creating a new subgraph or read the documentation</span>
      <ActionsContainer>
        <div className="sub-section">
          <h3>Documentation</h3>
          <a href="#" onClick={() => setShowDocs(true)}>
            How to start
          </a>
        </div>
      </ActionsContainer>
    </Root>
  )
}
