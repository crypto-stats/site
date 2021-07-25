import React, { useEffect } from 'react'
import MonacoEditor, { useMonaco } from "@monaco-editor/react";

// @ts-ignore
import file from '!raw-loader!./editor-library.d.ts'

const defaultAdapter = `
export function setup(context: Context) {
    context.register({
        id: 'my-adapter',
        queries: {},
        metadata: {},
    })
}
`

const Editor = () => {
  const monaco = useMonaco()
  useEffect(() => {
    if (monaco) {
      // validation settings
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false
      })
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false
      })

      // compiler options
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2019,
        allowNonTsExtensions: true,
        lib: ["es2018"],
      })
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2019,
        allowNonTsExtensions: true,
        lib: ["es2018"],
      })

      var sdkUri = 'ts:filename/sdk.d.ts';
      monaco.languages.typescript.javascriptDefaults.addExtraLib(file, sdkUri)
      // When resolving definitions and references, the editor will try to use created models.
      // Creating a model for the library allows "peek definition/references" commands to work with the library.
      monaco.editor.createModel(file, 'typescript', monaco.Uri.parse(sdkUri))
    }
  }, [monaco])

  return (
    <div>
      <MonacoEditor
        height="90vh"
        defaultLanguage="typescript"
        defaultValue={defaultAdapter}
      />
    </div>
  )
}

export default Editor
