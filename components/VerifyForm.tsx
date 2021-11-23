import React, { useState } from 'react'
// import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'

interface VerifyFormProps {
  listId: string
  listModules: string[]
  cid: string
  previousVersion: string | null
  onVerified: () => void
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

const VerifyForm: React.FC<VerifyFormProps> = ({ listId, /*listModules, */cid, previousVersion, onVerified }) => {
  const [pending, setPending] = useState(false)
  const { library } = useWeb3React()

  const add = async () => {
    setPending(true)
    try {
      const message = `Add ${cid} to ${listId}`
      const signature = await library.getSigner().signMessage(message)
      await sendUpdate(listId, 'add', signature, cid)
      onVerified()
    } catch (e) {}
    setPending(false)
  }

  const replace = async () => {
    setPending(true)
    try {
      const message = `Replace ${previousVersion} with ${cid} on ${listId}`
      const signature = await library.getSigner().signMessage(message)
      await sendUpdate(listId, 'update', signature, cid, previousVersion)
      onVerified()
    } catch (e) {}
    setPending(false)
  }

  return (
    <div>
      <div>
        <button onClick={add} disabled={pending}>
          Verify &amp; add to {listId}
        </button>
      </div>

      {previousVersion && (
        <div>
          <button onClick={replace} disabled={pending}>
            Replace previous adapter on {listId}
          </button>
        </div>
      )}
    </div>
  )
}

export default VerifyForm
