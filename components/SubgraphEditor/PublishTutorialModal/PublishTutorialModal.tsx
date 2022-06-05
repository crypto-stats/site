import React, { useState } from 'react'
import styled from 'styled-components'

import EditorModal, { Button as ModalButton } from '../EditorModal'

const Root = styled.div`
  color: var(--color-white);

  .info-p {
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
`

const DontShowItAgainCheckbox = styled.label`
  display: inline-flex;
  gap: 2px;
  align-items: center;
  color: var(--color-white);
  font-size: 14px;
`

const InstructionsList = styled.ul`
  list-style: none;
  padding: 0;
`

const InstructionLiItem = styled.li`
  margin: 0;
  display: grid;
  grid-template-columns: 50% 50%;
  margin-bottom: 24px;

  > .description {
    display: flex;
    flex-direction: column;

    > .title {
      margin: 0px;
      margin-bottom: 5px;
      font-size: 20px;
    }

    > .more-info {
      font-size: 14px;
      margin: 0;
      letter-spacing: 0.5px;
    }
  }
`

interface PublishModalProps {
  show: boolean
  proceedToPublish: ({ dontShowTutorialAgain }: { dontShowTutorialAgain: boolean }) => void
}

export const PublishTutorialModal: React.FC<PublishModalProps> = props => {
  const { show, proceedToPublish } = props
  const [dontShowTutorialAgain, setDontShowTutorialAgain] = useState(false)

  const buttons: ModalButton[] = [
    { label: 'OK, GOT IT', onClick: () => proceedToPublish({ dontShowTutorialAgain }) },
  ]

  return (
    <EditorModal
      isOpen={show}
      title={'Couple of things before the deployment'}
      buttons={buttons}
      footerElements={[
        () => (
          <DontShowItAgainCheckbox>
            <input
              type="checkbox"
              checked={dontShowTutorialAgain}
              onChange={e => setDontShowTutorialAgain(e.target.checked)}
            />
            <span className="checkmark"></span>
            Don't show again
          </DontShowItAgainCheckbox>
        ),
      ]}
      width={'1024px'}>
      <Root>
        <div className="info-p">
          In order to deploy the subgraph, you need to add a subgraph in your account on
          thegraph.com.
        </div>
        <InstructionsList>
          <InstructionLiItem>
            <div className="description">
              <h4 className="title">1. Go to your thegraph dashboard ↗</h4>
            </div>
          </InstructionLiItem>
          <InstructionLiItem>
            <div className="description">
              <h4 className="title">2. Add a subgraph</h4>
              <p className="more-info">
                Login with your github account, then access the dashboard and Add Subgraph.
              </p>
            </div>
          </InstructionLiItem>
          <InstructionLiItem>
            <div className="description">
              <h4 className="title">3. Get your subgraph slug</h4>
              <p className="more-info">
                Once you define your subgraph name, copy your subgraph URL; it’s required for the
                deployment. The URL should come in the form of
                thegraph.com/hosted-service/yourUsername/your-subgraph-name
              </p>
            </div>
          </InstructionLiItem>
          <InstructionLiItem>
            <div className="description">
              <h4 className="title">4. Get your subgraph access token</h4>
              <p className="more-info">Once you saved your subgraph, copy your access token.</p>
            </div>
          </InstructionLiItem>
        </InstructionsList>
      </Root>
    </EditorModal>
  )
}
