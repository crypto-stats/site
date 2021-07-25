import React, { useEffect, useRef } from 'react'
import MonacoEditor, { useMonaco } from "@monaco-editor/react";

// @ts-ignore
import sdkTypeDefs from '!raw-loader!./editor-library.d.ts'

const defaultModule = `
export function setup(context: Context) {
    context.register({
        id: 'my-adapter',
        queries: {},
        metadata: {},
    })
}
`

interface EditorProps {
  onValidated: (code: string) => void;
}

const Editor: React.FC<EditorProps> = ({ onValidated }) => {
  const code = useRef(defaultModule)
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
      monaco.languages.typescript.javascriptDefaults.addExtraLib(sdkTypeDefs, sdkUri)
      // When resolving definitions and references, the editor will try to use created models.
      // Creating a model for the library allows "peek definition/references" commands to work with the library.
      monaco.editor.createModel(sdkTypeDefs, 'typescript', monaco.Uri.parse(sdkUri))
    }
  }, [monaco])

  return (
    <div>
      <MonacoEditor
        height="60vh"
        defaultLanguage="typescript"
        defaultValue={defaultModule}
        onChange={(newCode?: string) => {
          code.current = newCode || ''
        }}
        onValidate={(markers: any[]) => {
          if (markers.length === 0) {
            onValidated(code.current)
          }
        }}
      />
    </div>
  )
}

export default Editor
