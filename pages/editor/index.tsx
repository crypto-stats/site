import { NextPage } from "next"
import Editor from "components/Editor"
import { CompilerProvider } from "hooks/compiler"
import { ConsoleProvider } from "hooks/console"

const EditorPage: NextPage = () => {
  return (
    <ConsoleProvider>
      <CompilerProvider>
        <Editor />
      </CompilerProvider>
    </ConsoleProvider>
  )
}

export default EditorPage
