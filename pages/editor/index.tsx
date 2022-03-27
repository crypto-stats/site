import { NextPage } from 'next'
import Editor from 'components/Editor'
import { CompilerProvider } from 'hooks/compiler'
import { ConsoleProvider } from 'hooks/console'
import { ASCompilerProvider } from 'hooks/useASCompiler'

const EditorPage: NextPage = () => {
  return (
    <ConsoleProvider>
      <CompilerProvider>
        <ASCompilerProvider>
          <Editor />
        </ASCompilerProvider>
      </CompilerProvider>
    </ConsoleProvider>
  )
}

export default EditorPage
