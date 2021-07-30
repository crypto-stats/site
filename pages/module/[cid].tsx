import React, { useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from 'components/Layout'
import { useFile } from 'hooks/ipfs'

function getSourceCID(file?: string | null) {
  if (!file) {
    return null
  }

  const result = /exports\.sourceFile = '([\w\d]{46})';/.exec(file)

  return result ? result[1] : null
}

const ModulePage: NextPage = () => {
  const [showSource, setShowSource] = useState(true)
  const router = useRouter()
  const { file, loading } = useFile(router.query.cid)
  const sourceCID = getSourceCID(file)
  const { file: sourceFile, loading: sourceLoading } = useFile(sourceCID)

  const code = sourceCID && showSource ? sourceFile : file

  return (
    <Layout>
      {loading || sourceLoading ? "Loading" : code ? (
        <pre>{code}</pre>
      ) : "Not found"}

      {sourceCID && (
        <div>
          Showing {showSource ? 'TS source. ' : 'compiled JS. '}
          <button onClick={() => setShowSource(!showSource)}>
            Show {showSource ? 'compiled JS' : 'TS source'}
          </button>
        </div>
      )}
    </Layout>
  )
}

export default ModulePage
