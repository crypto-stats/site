import React, { useState } from 'react'
import styled from 'styled-components'
import { useImages } from 'hooks/images'
import copy from 'copy-to-clipboard';
import FileUploadButton from './FileUploadButton'

const Cards = styled.ul`
  display: flex;
  flex-wrap: wrap;
`

const Card = styled.li`
  display: flex;
  flex-direction: column;
  height: 200px;
  width: 150px;
`

const Thumbnail = styled.div`
  flex: 1;
  background-size: auto;
  background-repeat: no-repeat;
  background-position: center;
`

const ImagePreviewContainer = styled.div`
  max-height: 100px;
  position: relative;
  text-align: center;
  margin: 10px 0;
`

const ImagePreview = styled.img`
  max-height: 100%;
  max-width: 100%;
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
  const [images, addImage] = useImages()

  if (selectedImage) {
    return (
      <div>
        <button onClick={() => setSelectedImage(null)}>Back</button>

        <ImagePreviewContainer>
          <ImagePreview src={`https://ipfs.io/ipfs/${selectedImage.cid}`} />
        </ImagePreviewContainer>

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

      <FileUploadButton
        onUploaded={(cid: string, type: string, name: string) => {
          addImage(cid, type, name)
          setSelectedImage({ cid, type })
        }}
      />

      <Cards>
        {images.map((image: any) => (
          <Card key={image.cid} onClick={() => setSelectedImage(image)}>
            <Thumbnail style={{ backgroundImage: `url('https://ipfs.io/ipfs/${image.cid}')` }} />
            {image.filename}
          </Card>
        ))}
      </Cards>
    </div>
  )
}

export default ImageSelector
