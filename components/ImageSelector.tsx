import React, { useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useImages } from 'hooks/images'
import copy from 'copy-to-clipboard';
import FileUploadButton from './FileUploadButton'
import { IPFS_GATEWAY } from 'utils/ipfs'

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

interface ImageSelectorProps {
  close: () => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ close }) => {
  const [selectedImage, setSelectedImage] = useState<null | { cid: string, type: string }>(null)
  const [uploading, setUploading] = useState(false)
  const [images, addImage] = useImages()

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
