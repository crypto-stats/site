import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import CodeViewer from 'components/CodeViewer'
import Layout from 'components/Layout'
import { useFile } from 'hooks/ipfs'
import { newModule } from 'hooks/local-adapters'

function getSourceCID(file?: string | null) {
  if (!file) {
    return null
  }

  const result = /exports\.sourceFile = '([\w\d]{46})';/.exec(file)

  return result ? result[1] : null
}

const ModulePage: NextPage = () => {
  const router = useRouter()
  const { file, loading } = useFile(router.query.cid?.toString())
  const sourceCID = getSourceCID(file)
  const { file: sourceFile, loading: sourceLoading } = useFile(sourceCID)

  const clone = () => {
    const id = newModule(sourceFile || file!, sourceFile ? sourceCID : router.query.cid!.toString())
    router.push(`/editor/${id}`)
  }

  return (
    <Layout>
      {loading || sourceLoading ? "Loading" : file ? (
        <div>
          <div>
            <button onClick={clone}>Edit/Clone</button>
          </div>

          <CodeViewer js={file} ts={sourceFile} />
        </div>
      ) : "Not found"}
    </Layout>
  )
}

export default ModulePage
