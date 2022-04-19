import { NextPage } from 'next'
import { NewSubgraph } from 'components/NewSubgraph'
import { CompilerProvider } from 'hooks/compiler'
import { ConsoleProvider } from 'hooks/console'

const NewSubgraphPage: NextPage = () => {
  return (
    <ConsoleProvider>
      <CompilerProvider>
        <NewSubgraph />
      </CompilerProvider>
    </ConsoleProvider>
  )
}

export default NewSubgraphPage
