import React, { useState } from 'react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript'
import ts from 'react-syntax-highlighter/dist/cjs/languages/hljs/typescript'
import theme from 'react-syntax-highlighter/dist/cjs/styles/hljs/stackoverflow-dark'

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('typescript', ts);

interface CodeViewerProps {
  js: string;
  ts?: string | null;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ js, ts }) => {
  const [showSource, setShowSource] = useState(true)
  
  return (
    <div>
      <SyntaxHighlighter
        language={ts && showSource ? 'typescript' : 'javascript'}
        style={theme}
        showLineNumbers
      >
        {ts && showSource ? ts : js}
      </SyntaxHighlighter>
      
      {ts && (
        <div>
          Showing {showSource ? 'TS source. ' : 'compiled JS. '}
          <button onClick={() => setShowSource(!showSource)}>
            Show {showSource ? 'compiled JS' : 'TS source'}
          </button>
        </div>
      )}
    </div>
  )
}

export default CodeViewer
