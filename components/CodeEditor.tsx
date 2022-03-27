import React, { useEffect, useRef } from 'react'
import MonacoEditor, { useMonaco } from '@monaco-editor/react'
import { MarkerSeverity } from './Editor/types'

// @ts-ignore
import sdkTypeDefs from '!raw-loader!generated/cryptostats-sdk.d.ts'

interface EditorProps {
  onValidated: (code: string, markers: any[]) => void
  onChange?: (code: string) => void
  defaultValue: string
  fileId: string
  onMount?: (editor: any, monaco: any) => void
  defaultLanguage?: 'typescript' | 'graphql'
}

const Editor: React.FC<EditorProps> = ({
  onValidated,
  onChange,
  defaultValue,
  fileId,
  onMount,
  defaultLanguage = 'typescript',
}) => {
  const code = useRef(defaultValue)
  const monaco = useMonaco()

  useEffect(() => {
    if (monaco) {
      // validation settings
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      })
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      })

      // compiler options
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2019,
        allowNonTsExtensions: true,
        lib: ['es2018'],
      })
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2019,
        allowNonTsExtensions: true,
        lib: ['es2018'],
      })

      var sdkUri = 'ts:filename/sdk.d.ts'
      monaco.languages.typescript.javascriptDefaults.addExtraLib(sdkTypeDefs, sdkUri)
      // When resolving definitions and references, the editor will try to use created models.
      // Creating a model for the library allows "peek definition/references" commands to work with the library.
      monaco.editor.createModel(sdkTypeDefs, 'typescript', monaco.Uri.parse(sdkUri))

      return () => monaco.editor.getModels().forEach((model: any) => model.dispose())
    }
  }, [monaco])

  useEffect(() => {
    code.current = defaultValue
  }, [fileId])

  return (
    <MonacoEditor
      theme="vs-dark"
      defaultLanguage={defaultLanguage}
      defaultValue={defaultValue}
      path={fileId}
      options={{
        tabSize: 2,
        insertSpaces: true,
        minimap: { enabled: false },
      }}
      onMount={(editor: any) => {
        if (onMount) {
          onMount(editor, monaco)
        }
      }}
      onChange={(newCode?: string) => {
        code.current = newCode || ''
        if (onChange && newCode) {
          onChange(newCode)
        }
      }}
      onValidate={(markers: MarkerSeverity[]) => {
        onValidated(code.current, markers)
      }}
    />
  )
}

export default Editor
