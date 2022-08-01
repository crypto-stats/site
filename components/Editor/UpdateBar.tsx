import React, { useState } from 'react'
import { useAdapter } from 'hooks/local-adapters'
import { useAdapterUpdates } from 'hooks/useAdapterUpdates'
import { Bottom } from 'react-spaces'
import { useEditorState } from 'hooks/editor-state'
import styled from 'styled-components'
import BaseButton from 'components/Button'
import { Version } from 'utils/lists-chain'
import { getSDK } from 'utils/sdk'

const Bar = styled(Bottom)`
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2px;
  background: #3c4854;
`

const Buttons = styled.div`
  display: flex;
`

const Button = styled(BaseButton)`
  margin: 0 2px;
`

const Link = styled.a`
  color: white;

  &:hover {
    color: #ccc;
  }
`

interface UpdateBarProps {
  fileName: string | null
  editorRef: React.MutableRefObject<any>
}

const UpdateBar: React.FC<UpdateBarProps> = ({ fileName, editorRef }) => {
  const { adapter, savePublications, save } = useAdapter(fileName)
  const [hiddenUpdates, setHiddenUpdates] = useEditorState<{ [update: string]: boolean }>(
    'hidden-updates',
    {}
  )
  const [loading, setLoading] = useState(false)

  const lastPublication =
    adapter?.publications && adapter.publications.length > 0
      ? adapter!.publications[adapter!.publications.length - 1]
      : null

  const updates = useAdapterUpdates(lastPublication?.cid, lastPublication?.version)

  if (updates.length === 0) {
    return null
  }

  const updateId = `${fileName!}-${updates[0].version}`
  if (hiddenUpdates[updateId]) {
    return null
  }

  const skip = () => setHiddenUpdates({ ...hiddenUpdates, [updateId]: true })

  const acceptUpdate = (version: Version) => async () => {
    setLoading(true)
    const sdk = getSDK()

    const tempCollection = sdk.getCollection('temp')
    const newAdapter = await tempCollection.fetchAdapterFromIPFS(version.cid)
    if (!newAdapter.sourceFile) {
      throw new Error('Adapter has no source code')
    }
    const adapterCode = await sdk.ipfs.getFile(newAdapter.sourceFile)

    editorRef.current.getModel().setValue(adapterCode)
    save(adapterCode, adapter!.name, version.version)
    savePublications(updates)
  }

  return (
    <Bar size={30}>
      <div>
        Update available: {}
        <Link href={`/discover/adapter/${updates[0].cid}`} target="update">
          {updates[0].version}
        </Link>
      </div>
      <Buttons>
        <Button size="small" disabled={loading} onClick={acceptUpdate(updates[0])}>
          Update
        </Button>
        <Button size="small" disabled={loading} onClick={skip}>
          Skip
        </Button>
      </Buttons>
    </Bar>
  )
}

export default UpdateBar
