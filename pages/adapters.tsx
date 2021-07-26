// import styled from 'styled-components'
import { NextPage } from 'next'
import Link from 'next/link';
import Layout from 'components/Layout'

const AdaptersPage: NextPage = () => {
  return (
    <Layout>
      <Link href="/editor">
        <a>New Adapter</a>
      </Link>
    </Layout>
  )
}

export default AdaptersPage
