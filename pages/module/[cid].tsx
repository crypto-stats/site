import React, { useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import CodeViewer from 'components/CodeViewer'
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
  const router = useRouter()
  const { file, loading } = useFile(router.query.cid)
  const sourceCID = getSourceCID(file)
  const { file: sourceFile, loading: sourceLoading } = useFile(sourceCID)

  return (
    <Layout>
      {loading || sourceLoading ? "Loading" : file ? (
        <CodeViewer js={file} ts={sourceFile} />
      ) : "Not found"}
    </Layout>
  )
}

export default ModulePage
