import React, { useEffect, useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useImages } from 'hooks/images'
import copy from 'copy-to-clipboard';
import FileUploadButton from './FileUploadButton'
import { IPFS_GATEWAY } from 'utils/ipfs'
import Button from './Button'

const Cards = styled.ul`
  display: flex;
  flex-wrap: wrap;
`

const Card = styled.li`
  display: flex;
  flex-direction: column;
  width: 150px;
  height: 150px;
  padding: 40px;
  border-radius: 5px;
  border: solid 1px #595959;
  margin: 12px;
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    background: #333333;
  }
`

const UploadCard = styled(Card)`
  padding: 0;
`

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const loadingMixin = css`
  cursor: default;

  &:before {
    content: "";
    background: none;
    border: 6px solid #aaa;
    border-color: #aaa transparent #aaa transparent;
    animation: ${spin} 1.2s linear infinite;
  }
`

const UploadButton = styled(FileUploadButton)<{ uploading: boolean }>`
  flex: 1;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  color: #cccccc;
  font-size: 14px;
  align-items: center;
  justify-content: space-between;
  padding: 20px;

  &:before {
    content: '+';
    font-size: 40px;
    display: block;
    height: 80px;
    width: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #222222;
    border-radius: 100px;
    color: #666666;
    box-sizing: border-box;
  }

  ${({ uploading }) => uploading ? loadingMixin : ''}
`

const Thumbnail = styled.div`
  flex: 1;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`

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

const NAME_REGEX = /\n(\s*)"?name"?:\s*(?:"|')([\w\d- ]+)(?:"|'),/g

interface ImageSelectorProps {
  close: () => void
  editor?: any
}

interface MetadataName {
  code: string
  name: string
  whitespace: string
  position: number
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ close, editor }) => {
  const [selectedImage, setSelectedImage] = useState<null | { cid: string, type: string }>(null)
  const [uploading, setUploading] = useState(false)
  const [metadataNames, setMetadataNames] = useState<MetadataName[]>([])
  const [images, addImage] = useImages()

  useEffect(() => {
    if (selectedImage && editor) {
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
  }, [selectedImage])

  if (selectedImage) {
    return (
      <div>
        <button onClick={() => setSelectedImage(null)}>Back</button>

        <ImagePreviewContainer
          style={{ backgroundImage: `url('${IPFS_GATEWAY}/ipfs/${selectedImage.cid}')` }}
        />

        <div>Attach an image stored on IPFS to an adapter by using the getDataURILoader function</div>

        <div>Example:</div>

        <Code>
          <CodeLine>{'  metadata: {'}</CodeLine>
          <CodeLine>    name: 'Uniswap V1',</CodeLine>
          <CodeLine>    category: 'dex',</CodeLine>
          <CodeLine>
            {'    icon: '}
            <Copyable>sdk.ipfs.getDataURILoader('{selectedImage.cid}', '{selectedImage.type}')</Copyable>
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
${metadataName.whitespace}icon: sdk.ipfs.getDataURILoader('${selectedImage.cid}', '${selectedImage.type}'),${currentCode.slice(slicePoint)}`

              model.setValue(newCode)
              close()
            }

            return (
              <Button key={metadataName.position} onClick={add}>Add to {metadataName.name}</Button>
            )
          })}

          <button onClick={() => {
            copy(`sdk.ipfs.getDataURILoader('${selectedImage.cid}', '${selectedImage.type}')`)
            close()
          }}>
            Copy and close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <button onClick={close}>Close</button>


      <Cards>
        <UploadCard>
          <UploadButton
            uploading={uploading}
            onUploadStart={() => setUploading(true)}
            onUploaded={(cid: string, type: string, name: string) => {
              addImage(cid, type, name)
              setSelectedImage({ cid, type })
              setUploading(false)
            }}
          />
        </UploadCard>

        {images.map((image: any) => (
          <Card key={image.cid} onClick={() => setSelectedImage(image)}>
            <Thumbnail style={{ backgroundImage: `url('${IPFS_GATEWAY}/ipfs/${image.cid}')` }} />
            {image.filename}
          </Card>
        ))}
      </Cards>
    </div>
  )
}

export default ImageSelector
