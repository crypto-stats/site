import { useEditorState } from 'hooks/editor-state'
import React from 'react'
import styled from 'styled-components'

import EditorModal, { Button as ModalButton } from '../EditorModal'

const STUDIO_URL = 'https://thegraph.com/studio/'

const Root = styled.div`
  color: var(--color-white);

  .info-p {
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  a {
    color: #cda9ef;
  }
  a:hover {
    color: #b279e6;
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
  margin-bottom: 42px;
  margin-right: 24px;

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

const ImageBox = styled.div`
  float: right;
  width: 300px;

  img {
    width: 100%;
  }
`

interface PublishModalProps {
  show: boolean
  proceedToPublish: ({ dontShowTutorialAgain }: { dontShowTutorialAgain: boolean }) => void
}

export const PublishTutorialModal: React.FC<PublishModalProps> = props => {
  const { show, proceedToPublish } = props
  const [dontShowTutorialAgain, setDontShowTutorialAgain] = useEditorState(
    'skip-subgraph-deploy-tutorial',
    false
  )

  const buttons: ModalButton[] = [
    { label: 'OK, GOT IT', onClick: () => proceedToPublish({ dontShowTutorialAgain }) },
  ]

  return (
    <EditorModal
      isOpen={show}
      title="Let's get ready to deploy your subgraph..."
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

        <ImageBox>
          <img src="/subgraph/tutorial0.png" />
          <img src="/subgraph/tutorial2.png" />
          <img src="/subgraph/tutorial3-crop.png" />
        </ImageBox>

        <InstructionsList>
          <InstructionLiItem>
            <div className="description">
              <h4 className="title">
                1. Open the{' '}
                <a href={STUDIO_URL} target="studio">
                  Subgraph Studio ↗
                </a>
              </h4>
              <p className="more-info">
                Connect your wallet to the Subgraph Studio and sign a message to log in.
              </p>
            </div>
          </InstructionLiItem>
          <InstructionLiItem>
            <div className="description">
              <h4 className="title">2. Create a subgraph</h4>
              <p className="more-info">Select the chain to index and give your subgraph a name.</p>
            </div>
          </InstructionLiItem>
          <InstructionLiItem>
            <div className="description">
              <h4 className="title">3. Get your subgraph slug &amp; deploy key</h4>
              <p className="more-info">
                Once you create your subgraph, copy the "subgraph slug" and "deploy key" values from
                the top of the page. You'll need to provide these values on the next screen.
              </p>
            </div>
          </InstructionLiItem>
        </InstructionsList>
      </Root>
    </EditorModal>
  )
}
