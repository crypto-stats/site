import React, { useState } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import RowSection from 'components/RowSection'
import ColumnSection from 'components/ColumnSection'
import Text from 'components/Text'
import Button from 'components/Button'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript'
// @ts-ignore
import theme from 'react-syntax-highlighter/dist/cjs/styles/hljs/stackoverflow-dark'

SyntaxHighlighter.registerLanguage('javascript', js)

const sdkCode = `const { CryptoStatsSDK } = require('@cryptostats/sdk');
(async function() {
  const sdk = new CryptoStatsSDK({
    moralisKey: '<your key>',
  });
  const list = sdk.getList('fees');
  await list.fetchAdapters();

  const result = await list.executeQuery('oneDayTotalFees', '2022-01-01');
  console.log(result);
})();`

const restCode = `const url = 'https://api.cryptostats.community/api/v1/fees/oneDayTotalFees/2022-01-01';
const response = await fetch(url);
const json = await response.json();
console.log(json);`

const Graphic = styled.img`
  width: 100%;
  height: auto;
`

const CodeCard = styled.div`
  border-radius: 10px;
  background-color: #fff;
  overflow: hidden;
  background: #404C59;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.04), 0 10px 35px 16px rgba(0,36,75,0.05);
  margin-bottom: var(--spaces-6);
`

const CodeCardHeader = styled.div`
  border: solid 1px #ddd;
  background: white;
  padding: var(--spaces-3) var(--spaces-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Syntax = styled(SyntaxHighlighter)`
  margin: 0;
  padding: var(--spaces-4) !important;
`

const Toggle = styled.button`
  ${({ disabled }) => disabled ? `
    background-color: #d6eaff;
    color: #0477f4;
    font-weight: 600;
  ` : `
    color: #4e4e4e;
    background-color: #eef1f7;
    cursor: pointer;

    &:hover {
      background-color: #d6eaff;
    }
  `}
  font-size: 12px;
  border-radius: 8px;
  border: none;
  outline: none;
  padding: 6px 16px;

  & + & {
    margin-left: var(--spaces-3);
  }
`

enum CodeType {
  SDK,
  REST,
}

const Actions: React.FC = () => {
  const [codeType, setCodeType] = useState(CodeType.SDK)

  return (
    <> 
      <RowSection mt="120">
        <ColumnSection from="1" to="6">
          <Text tag="h3" type="title_highlight" mb="40" align="center">Create</Text>
          <Graphic src="/editor-thumbnail.png" alt="editor" />
          <Text tag="p" type="content_big" mt="32" mb="32">Create and update the adapers that provide data to CryptoStats. Write, test and publish the code right in the browser!</Text>
          <Link href="/editor" passHref>
            <Button variant="outline" size="large">Open the adapter editor</Button>
          </Link>
        </ColumnSection>
        <ColumnSection from="8" to="13">
          <Text tag="h3" type="title_highlight" mb="40" align="center">Discover</Text>
          <Graphic src="/image-collections.png" alt="Collections" />
          <Text tag="p" type="content_big" mt="32" mb="32">Review a wide range of data metrics, covering protocols across the crypto space.</Text>
          <Link href="/discover" passHref>
            <Button variant="outline" size="large">Browse data sets</Button>
          </Link>
        </ColumnSection>
      </RowSection>

      <RowSection mt="64">
        <ColumnSection from="3" to="11">
          <Text tag="h3" type="title_highlight" mb="24" align="center">Consume and use data</Text>
          <Text tag="p" type="content_big" mb="32" align="center">Use trustworthy data metrics in your website or dapp. It's free and always will be</Text>

          <CodeCard>
            <CodeCardHeader>
              <Text tag="p" type="content">Using the Data is easy. Try it out</Text>
              <div>
                <Toggle disabled={codeType === CodeType.SDK} onClick={() => setCodeType(CodeType.SDK)}>CryptoStats SDK</Toggle>
                <Toggle disabled={codeType === CodeType.REST} onClick={() => setCodeType(CodeType.REST)}>REST API</Toggle>
              </div>
            </CodeCardHeader>

            <Syntax language="javascript" style={theme} showLineNumbers>
              {codeType === CodeType.SDK ? sdkCode : restCode}
            </Syntax>
          </CodeCard>
          <Button variant="outline" size="large" centered>Read the docs</Button>
        </ColumnSection>
      </RowSection>
    </>
  )
}

export default Actions
