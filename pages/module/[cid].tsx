import React from 'react'
import { NextPage, GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import { useRouter } from 'next/router'
import CodeViewer from 'components/CodeViewer'
import Layout from 'components/Layout'
import { useFile } from 'hooks/ipfs'
import { newModule } from 'hooks/local-adapters'
import { getSourceCID } from 'utils/adapters'
import { getTextFileFromIPFS } from 'utils/ipfs'

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

export const getStaticProps: GetStaticProps<any, { cid: string }> = async (ctx: GetStaticPropsContext) => {
  const cid = ctx.params!.cid!.toString()
  const mainFile = await getTextFileFromIPFS(cid)
  const ipfsCache = [{ cid, text: mainFile }]

  const sourceCID = getSourceCID(mainFile)
  if (sourceCID) {
    const sourceFile = await getTextFileFromIPFS(sourceCID)
    ipfsCache.push({ cid: sourceCID, text: sourceFile })
  }

  return {
    props: {
      ipfsCache
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}
