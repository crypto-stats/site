import Editor from 'components/Editor'
import { CompilerProvider } from 'hooks/compiler'

const EditorPage: NextPage = () => {
  return (
    <CompilerProvider>
      <Editor />
    </CompilerProvider>
  )
}

export default EditorPage
