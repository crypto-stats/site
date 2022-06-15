import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { useOnClickOutside, useLocalSubgraph } from 'hooks'
import { HeaderRight, SubgraphHeader, WalletButton } from 'components/layouts'
import Button from 'components/Button'
import { MarkerSeverity } from './types'
import { PublishModal } from './PublishModal/'
import { PublishTutorialModal } from './PublishTutorialModal'
import { getLocalStorage, setLocalStorage } from '../../utils/localstorage'

const STORAGE_KEY = 'dont-show-tutorial-again'

const Root = styled(SubgraphHeader)`
  .wallet-connect-btn {
    text-transform: uppercase;
    background-color: inherit;
    color: var(--color-white);

    &:hover {
      background-color: var(--color-primary);
    }
  }
`

const SubgraphTitle = styled.div`
  color: #d3d3d3;
  margin: 24px 8px;

  input {
    all: unset;
    border: solid 1px #979797;
    padding: 5px 10px;
  }

  h2,
  input {
    margin: 0px;
    font-size: 22px;
    font-weight: bold;
  }
`

const PublishButton = styled(Button)`
  height: 35px;
  margin: 0 16px;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
  font-weight: normal;
  position: relative;
  text-transform: uppercase;
  min-width: 120px;

  &:disabled:hover:before {
    content: 'Fix all errors to allow publishing';
    display: block;
    position: absolute;
    z-index: 100;
    left: 0;
    transform: translateX(-140px);
    top: 0;
    bottom: 0;
    background: #222222;
    padding: 2px;
    font-size: 12px;
    border-radius: 4px;
    color: #cccccc;
  }
`

interface PrimaryHeaderProps {
  filename: string | null
  markers: any[]
  editorRef: any
  showDocs: boolean
}

export const PrimaryHeader = (props: PrimaryHeaderProps) => {
  const { filename, markers, editorRef, showDocs } = props
  const { subgraph, update } = useLocalSubgraph(filename)
  const [modalStatus, setModalStatus] = useState({ publish: false, publishTutorial: false })
  const [editingTitle, setEditingTitle] = useState(false)
  const [showPublishTutorial, setShowPublishTutorial] = useState(false)
  const [titleValue, setTitleValue] = useState(subgraph?.name || '')
  const ref = useRef<any>()

  useEffect(() => {
    if (subgraph && subgraph.name !== titleValue) {
      setTitleValue(subgraph.name!)
    }
  }, [subgraph])

  useOnClickOutside(ref, () => setEditingTitle(false))

  useEffect(() => {
    const loadTutorialStatus = async () => {
      const didCloseTutorialBefore = (await getLocalStorage(STORAGE_KEY)) || false
      setShowPublishTutorial(!didCloseTutorialBefore)
    }

    loadTutorialStatus()
  }, [])

  const proceedToPublish = ({ dontShowTutorialAgain = false }) => {
    setModalStatus({ publish: true, publishTutorial: false })
    setLocalStorage(STORAGE_KEY, dontShowTutorialAgain)
    setShowPublishTutorial(!dontShowTutorialAgain)
  }

  const infos = []
  const warnings = []
  const errors = []

  for (const marker of markers) {
    if (marker.severity === MarkerSeverity.Error) {
      errors.push(marker)
    } else if (marker.severity === MarkerSeverity.Warning) {
      warnings.push(marker)
    } else {
      infos.push(marker)
    }
  }

  return (
    <Root size={80} order={1} $extendedLeftSide={showDocs}>
      {subgraph ? (
        <SubgraphTitle onClick={() => setEditingTitle(prev => !prev)}>
          {!editingTitle ? (
            <h2>{titleValue}</h2>
          ) : (
            <input
              ref={ref}
              autoFocus
              value={titleValue}
              onChange={e => update({ ...subgraph!, name: e.target.value })}
            />
          )}
        </SubgraphTitle>
      ) : null}

      <HeaderRight>
        <WalletButton className="wallet-connect-btn" />
        {subgraph && (
          <PublishButton
            onClick={() =>
              setModalStatus(prev => ({
                ...prev,
                [showPublishTutorial ? 'publishTutorial' : 'publish']: true,
              }))
            }
            disabled={errors.length > 0}
            className="primary">
            Publish
          </PublishButton>
        )}
      </HeaderRight>

      {filename && (
        <>
          <PublishModal
            fileName={filename}
            show={modalStatus.publish}
            onClose={() => setModalStatus(prev => ({ ...prev, publish: false }))}
            editorRef={editorRef}
          />
          <PublishTutorialModal
            show={modalStatus.publishTutorial}
            proceedToPublish={proceedToPublish}
          />
        </>
      )}
    </Root>
  )
}
