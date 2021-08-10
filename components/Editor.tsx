import React, { useEffect, useRef } from 'react'
import MonacoEditor, { useMonaco } from '@monaco-editor/react'
import styled from 'styled-components'

// @ts-ignore
import sdkTypeDefs from '!raw-loader!./editor-library.d.ts'

const OuterContainer = styled.div`
  position: relative;
  flex: 1;
`

const InnerContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

interface EditorProps {
  onValidated: (code: string) => void;
  defaultValue: string;
}

const Editor: React.FC<EditorProps> = ({ onValidated, defaultValue }) => {
  const code = useRef(defaultValue)
  const editorRef = useRef<any>(null)
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

      return () => monaco.editor.getModels().forEach(model => model.dispose())
    }
  }, [monaco])

  return (
    <OuterContainer>
      <InnerContainer>
        <MonacoEditor
          defaultLanguage="typescript"
          defaultValue={defaultValue}
          options={{
            tabSize: 2,
            insertSpaces: true,
          }}
          onMount={(editor: any) => {
            editorRef.current = editor
          }}
          onChange={(newCode?: string) => {
            code.current = newCode || ''
          }}
          onValidate={(markers: any[]) => {
            if (markers.length === 0) {
              onValidated(code.current)
            }
          }}
        />
      </InnerContainer>
    </OuterContainer>
  )
}

export default Editor
