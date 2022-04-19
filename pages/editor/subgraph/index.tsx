import { NextPage } from 'next'
import SubgraphEditor from 'components/SubgraphEditor'
import { CompilerProvider } from 'hooks/compiler'
import { ConsoleProvider } from 'hooks/console'

const SubgraphEditorPage: NextPage = () => {
  return (
    <ConsoleProvider>
      <CompilerProvider>
        <SubgraphEditor />
      </CompilerProvider>
    </ConsoleProvider>
  )
}

export default SubgraphEditorPage
