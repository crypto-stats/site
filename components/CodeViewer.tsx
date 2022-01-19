import React, { useState } from 'react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript'
import ts from 'react-syntax-highlighter/dist/cjs/languages/hljs/typescript'
// @ts-ignore
import theme from 'react-syntax-highlighter/dist/cjs/styles/hljs/github-gist'
import styled from 'styled-components'


SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('typescript', ts);

const CodeViewerContainer = styled.div`
  margin-top: 24px;
  border: 1px solid var(--color-primary-800);
  border-radius: 4px;
`

interface CodeViewerProps {
  js: string;
  ts?: string | null;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ js, ts }) => {
  const [showSource, setShowSource] = useState(true)
  
  return (
    <>
    <CodeViewerContainer>
      <SyntaxHighlighter
        language={ts && showSource ? 'typescript' : 'javascript'}
        style={theme}
        lineNumberStyle={{color:"#ababab"}}
        showLineNumbers
      >
        {ts && showSource ? ts : js}
      </SyntaxHighlighter>
    </CodeViewerContainer>
      {ts && (
        <div>
          Showing {showSource ? 'TS source. ' : 'compiled JS. '}
          <button onClick={() => setShowSource(!showSource)}>
            Show {showSource ? 'compiled JS' : 'TS source'}
          </button>
        </div>
      )}
    </>
  )
}

export default CodeViewer
