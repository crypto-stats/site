import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import copy from 'copy-to-clipboard';
import { IPFS_GATEWAY } from 'resources/constants'
import Button from 'components/Button';

const ImagePreviewContainer = styled.div`
  height: 100px;
  position: relative;
  text-align: center;
  margin: 10px 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
`

const Code = styled.div`
  font-family: monospace;
  color: #777777;
  white-space: pre-wrap;
`

const CodeLine = styled.div``

const CopyableSpan = styled.span`
  color: #000000;
`

const Copyable: React.FC = ({ children }) => {
  return (
    <CopyableSpan>
      {children}
      <button onClick={() => copy(children as string)}>Copy</button>
    </CopyableSpan>
  )
}

interface MetadataName {
  code: string
  name: string
  whitespace: string
  position: number
}

const NAME_REGEX = /\n(\s*)"?name"?:\s*(?:"|')([\w\d- ]+)(?:"|'),/g

interface ImagePreviewProps {
  editor: any
  cid: string
  type: string
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ editor, cid, type }) => {
  const [metadataNames, setMetadataNames] = useState<MetadataName[]>([])

  useEffect(() => {
    if (editor) {
      const model = editor.getModel()
      const value = model.getValue()

      const metadataNames: MetadataName[] = []

      let result;
      do {
        result = NAME_REGEX.exec(value);
        if (result) {
          metadataNames.push({
            code: result[0],
            name: result[2],
            whitespace: result[1],
            position: result.index,
          })
        }
      } while (result);

      setMetadataNames(metadataNames)
    }
  }, [editor])

  return (
    <div>
      <ImagePreviewContainer
        style={{ backgroundImage: `url('${IPFS_GATEWAY}/ipfs/${cid}')` }}
      />

      <div>Attach an image stored on IPFS to an adapter by using the getDataURILoader function</div>

      <div>Example:</div>

      <Code>
        <CodeLine>{'  metadata: {'}</CodeLine>
        <CodeLine>    name: 'Uniswap V1',</CodeLine>
        <CodeLine>    category: 'dex',</CodeLine>
        <CodeLine>
          {'    icon: '}
          <Copyable>sdk.ipfs.getDataURILoader('{cid}', '{type}')</Copyable>
          ,
        </CodeLine>
        <CodeLine>{'  }'}</CodeLine>
      </Code>

      <div>
        {metadataNames.map(metadataName => {
          const add = () => {
            const model = editor.getModel()
            const currentCode = model.getValue()
            const slicePoint = metadataName.position + metadataName.code.length
            const newCode = `${currentCode.slice(0, slicePoint)}
${metadataName.whitespace}icon: sdk.ipfs.getDataURILoader('${cid}', '${type}'),${currentCode.slice(slicePoint)}`

            model.setValue(newCode)
            close()
          }

          return (
            <Button key={metadataName.position} onClick={add}>Add to {metadataName.name}</Button>
          )
        })}

        <button onClick={() => {
          copy(`sdk.ipfs.getDataURILoader('${cid}', '${type}')`)
          close()
        }}>
          Copy and close
        </button>
      </div>
    </div>
  )
}

export default ImagePreview
