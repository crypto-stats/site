import React, { useState } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import CollectionCard from './CollectionCard'
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

const Graphic = styled.div<{ background?: string }>`
  aspect-ratio: 3 / 2;
  position: relative;
  background-size: 80%;
  background-position: center;
  background-repeat: no-repeat;

  ${({ background }) => background && `background-image: url('${background}');`}
`

const CodeCard = styled.div`
  border-radius: 10px;
  box-shadow: 0 10px 35px 16px rgba(0, 36, 75, 0.05), 0 2px 4px 0 rgba(0, 0, 0, 0.04);
  border: solid 1px #ddd;
  background-color: #fff;
  overflow: hidden;
`

const CodeCardHeader = styled.div`
  border: solid 1px #ddd;
  background: white;
  height: 53px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const Syntax = styled(SyntaxHighlighter)`
  margin: 0;
  padding: 16px 8px !important;
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
  margin: 0 6px;
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
        <ColumnSection from="2" to="7">
          <Text tag="h3" type="title_highlight" mb="40" align="center">Create</Text>
          <Graphic background="/editor-thumbnail.png"/>
          <Text tag="p" type="content_big" mb="16">Create and update the adapers that provide data to CryptoStats. Write, test and publish the code right in the browser!</Text>
          <Link href="/editor" passHref>
            <Button variant="outline" size="large">Open the adapter editor</Button>
          </Link>
        </ColumnSection>
        <ColumnSection from="7" to="12">
          <Text tag="h3" type="title_highlight" mb="40" align="center">Discover</Text>
          <Graphic>
            <CollectionCard position="TopLeft" collection="treasuries" />
            <CollectionCard position="Center" collection="apy-current" />
            <CollectionCard position="BottomRight" collection="fees" />
          </Graphic>
          <Text tag="p" type="content_big" mb="16">Review a wide range of data metrics, covering protocols across the crypto space.</Text>
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
              <Toggle disabled={codeType === CodeType.SDK} onClick={() => setCodeType(CodeType.SDK)}>CryptoStats SDK</Toggle>
              <Toggle disabled={codeType === CodeType.REST} onClick={() => setCodeType(CodeType.REST)}>REST API</Toggle>
            </CodeCardHeader>

            <Syntax language="javascript" style={theme} showLineNumbers>
              {codeType === CodeType.SDK ? sdkCode : restCode}
            </Syntax>
          </CodeCard>
          <Button variant="outline" size="large">Read the docs</Button>
        </ColumnSection>
      </RowSection>
    </>
  )
}

export default Actions
