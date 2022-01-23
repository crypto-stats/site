import React, { useState } from 'react'
import { useImages } from 'hooks/images'
import styled, { css, keyframes } from 'styled-components'
import FileUploadButton from 'components/FileUploadButton'
import { IPFS_GATEWAY } from 'resources/constants'

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

interface ImageGaleryProps {
  onSelectedImage: (image: { cid: string, type: string }) => void
}

const ImageGalery: React.FC<ImageGaleryProps> = ({ onSelectedImage }) => {
  const [images, addImage] = useImages()
  const [uploading, setUploading] = useState(false)
  
  return (
    <div>
      <Cards>
        <UploadCard>
          <UploadButton
            uploading={uploading}
            onUploadStart={() => setUploading(true)}
            onUploaded={(cid: string, type: string, name: string) => {
              addImage(cid, type, name)
              onSelectedImage({ cid, type })
              setUploading(false)
            }}
          />
        </UploadCard>

        {images.map((image: any) => (
          <Card key={image.cid} onClick={() => onSelectedImage(image)}>
            <Thumbnail style={{ backgroundImage: `url('${IPFS_GATEWAY}/ipfs/${image.cid}')` }} />
            {image.filename}
          </Card>
        ))}
      </Cards>
    </div>
  )
}

export default ImageGalery
