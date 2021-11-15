// import styled from 'styled-components'
import { NextPage } from 'next'
import Link from 'next/link';
import Layout from 'components/Layout'
import { useAdapterList } from 'hooks/local-adapters'

const AdaptersPage: NextPage = () => {
  const adapters = useAdapterList()

  return (
    <Layout>
      <Link href="/editor/new">
        <a>New Adapter</a>
      </Link>

      <ul>
        {adapters.map((adapter: any) => (
          <li key={adapter.id}>
            <Link href={{
              pathname: '/editor',
              query: { adapter: adapter.id },
            }}>
              <a>{adapter.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export default AdaptersPage
