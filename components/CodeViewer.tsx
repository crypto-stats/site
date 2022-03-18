import React, { useState } from 'react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript'
import ts from 'react-syntax-highlighter/dist/cjs/languages/hljs/typescript'
// @ts-ignore
import theme from 'react-syntax-highlighter/dist/cjs/styles/hljs/github-gist'
import styled from 'styled-components'
import Text from 'components/Text'
import Button from 'components/Button'

SyntaxHighlighter.registerLanguage('javascript', js)
SyntaxHighlighter.registerLanguage('typescript', ts)

const CodeViewerContainer = styled.div`
  margin-top: 24px;
  border: 1px solid var(--color-primary-800);
  border-radius: 4px;
`
const CodeViewerHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 14px 24px;
  border-bottom: 1px solid #ddd;
`

const ChangeSource = styled.div`
  display: flex;
  align-items: center;

  & > button {
    margin-left: 16px;
  }
`

interface CodeViewerProps {
  js: string
  ts?: string | null
}

const CodeViewer: React.FC<CodeViewerProps> = ({ js, ts }) => {
  const [showSource, setShowSource] = useState(true)

  return (
    <>
      <CodeViewerContainer>
        <CodeViewerHead>
          <Text tag="h4" type="content">
            Source code
          </Text>
          {ts && (
            <ChangeSource>
              <Text tag="span" type="description">
                Showing {showSource ? 'TS source. ' : 'compiled JS. '}
              </Text>
              <Button variant="outline" onClick={() => setShowSource(!showSource)}>
                Show {showSource ? 'compiled JS' : 'TS source'}
              </Button>
            </ChangeSource>
          )}
        </CodeViewerHead>
        <SyntaxHighlighter
          language={ts && showSource ? 'typescript' : 'javascript'}
          style={theme}
          lineNumberStyle={{ color: '#ababab' }}
          customStyle={{
            fontSize: '14px',
            backgroundColor: '#F9FAFF',
            lineHeight: '1.4',
            paddingTop: '0px !important',
          }}
          showLineNumbers
        >
          {ts && showSource ? ts : js}
        </SyntaxHighlighter>
      </CodeViewerContainer>
    </>
  )
}

export default CodeViewer
