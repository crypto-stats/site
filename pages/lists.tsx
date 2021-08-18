import { NextPage, GetStaticProps } from 'next'
import Layout from 'components/Layout'
import { getListNames } from 'utils/lists'

interface AdaptersPageProps {
  lists: string[]
}

const AdaptersPage: NextPage<AdaptersPageProps> = ({ lists }) => {
  return (
    <Layout>
      <ul>
        {lists.map((list: string) => (
          <li key={list}>
            {list}
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export default AdaptersPage


export const getStaticProps: GetStaticProps<AdaptersPageProps> = async () => {
  const lists = await getListNames()

  return {
    props: {
      lists
    },
  }
}
