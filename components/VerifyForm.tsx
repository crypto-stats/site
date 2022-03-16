import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Version } from 'utils/lists-chain'

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
`

interface VerifyFormProps {
  listId: string
  listModules: string[]
  cid: string
  previousVersion: string | null
  previousVersions: Version[]
  onVerified: (val: boolean) => void
}

async function sendUpdate(
  listId: string,
  method: string,
  signature: string,
  cid: string,
  previousVersion?: string | null
) {
  const req = await fetch('/api/update-list', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      listId,
      cid,
      signature,
      method,
      previousVersion,
    }),
  })
  const response = await req.json()

  if (!response.success) {
    throw new Error(response.error)
  }
}

const VerifyForm: React.FC<VerifyFormProps> = ({
  listId,
  listModules,
  cid,
  previousVersion,
  onVerified,
  previousVersions,
}) => {
  const [pending, setPending] = useState(false)
  const [selectedCid, setSelectedCid] = useState(previousVersion)
  const [otherCid, setOtherCid] = useState('')
  const { library } = useWeb3React()

  useEffect(() => {
    for (const version of previousVersions) {
      if (version.verified) {
        setSelectedCid(version.cid)
        return
      }
    }
  }, [previousVersions])

  const add = async () => {
    setPending(true)
    try {
      const message = `Add ${cid} to ${listId}`
      const signature = await library.getSigner().signMessage(message)
      await sendUpdate(listId, 'add', signature, cid)
      onVerified(true)
    } catch (e) {}
    setPending(false)
  }

  const replace = async () => {
    setPending(true)
    try {
      const fromCid = selectedCid === 'other' ? otherCid : selectedCid
      const message = `Replace ${fromCid} with ${cid} on ${listId}`
      const signature = await library.getSigner().signMessage(message)
      await sendUpdate(listId, 'update', signature, cid, fromCid)
      onVerified(true)
    } catch (e) {}
    setPending(false)
  }

  const remove = async () => {
    setPending(true)
    try {
      const message = `Remove ${cid} from ${listId}`
      const signature = await library.getSigner().signMessage(message)
      await sendUpdate(listId, 'remove', signature, cid)
      onVerified(false)
    } catch (e) {}
    setPending(false)
  }

  const verified = listModules.indexOf(cid) !== -1

  return (
    <FormContainer>
      {verified ? (
        <button onClick={remove} disabled={pending}>
          Remove from {listId}
        </button>
      ) : (
        <button onClick={add} disabled={pending}>
          Verify &amp; add to {listId}
        </button>
      )}

      {previousVersion && (
        <>
          <select value={selectedCid || undefined} onChange={e => setSelectedCid(e.target.value)}>
            {previousVersions.map(version => (
              <option key={version.cid} value={version.cid}>
                {version.verified &&
                  (version.activeCollections.indexOf(listId) !== -1 ? '✅ ' : '✔️ ')}
                {version.version} ({version.cid})
              </option>
            ))}
            <option value='other'>Other</option>
          </select>

          {selectedCid === 'other' && (
            <input value={otherCid} onChange={(e: any) => setOtherCid(e.target.value)} />
          )}

          <button onClick={replace} disabled={pending}>
            Replace previous adapter on {listId}
          </button>
        </>
      )}
    </FormContainer>
  )
}

export default VerifyForm
