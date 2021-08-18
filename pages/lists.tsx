import { NextPage, GetStaticProps } from 'next'
import Link from 'next/link';
import Layout from 'components/Layout'
import { getListNames, getModulesForList } from 'utils/lists'

interface AdaptersPageProps {
  lists: { name: string; modules: string[] }[]
}

const AdaptersPage: NextPage<AdaptersPageProps> = ({ lists }) => {
  return (
    <Layout>
      <ul>
        {lists.map(list => (
          <li key={list.name}>
            <div>{list.name}</div>
            <ul>
              {list.modules.map(_module => (
                <li key={_module}>
                  <Link href={`/module/${_module}`}>
                    <a>{_module}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export default AdaptersPage


export const getStaticProps: GetStaticProps<AdaptersPageProps> = async () => {
  const listNames = await getListNames()

  const lists = await Promise.all(listNames.map(async (name: string) => ({
    name: name,
    modules: await getModulesForList(name),
  })))

  return {
    props: {
      lists
    },
    revalidate: 60,
  }
}
