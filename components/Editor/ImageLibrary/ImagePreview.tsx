import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { IPFS_GATEWAY } from 'resources/constants'
import DropdownButton from 'components/DropdownButton'

const ImagePreviewContainer = styled.div`
  height: 100px;
  position: relative;
  text-align: center;
  margin: 10px 0;
  width: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

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
  close: () => void
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ editor, cid, type, close }) => {
  const [metadataNames, setMetadataNames] = useState<MetadataName[]>([])

  useEffect(() => {
    if (editor) {
      const model = editor.getModel()
      const value = model.getValue()

      const metadataNames: MetadataName[] = []

      let result
      do {
        result = NAME_REGEX.exec(value)
        if (result) {
          metadataNames.push({
            code: result[0],
            name: result[2],
            whitespace: result[1],
            position: result.index,
          })
        }
      } while (result)

      setMetadataNames(metadataNames)
    }
  }, [editor])

  const options = metadataNames.map((name: MetadataName) => ({
    value: name.name,
    label: `Add to ${name.name}`,
    onClick: () => {
      const model = editor.getModel()
      const currentCode = model.getValue()
      const slicePoint = name.position + name.code.length
      const newCode = `${currentCode.slice(0, slicePoint)}
${name.whitespace}icon: sdk.ipfs.getDataURILoader('${cid}', '${type}'),${currentCode.slice(
        slicePoint
      )}`

      model.setValue(newCode)
      close()
    },
  }))

  return (
    <Container>
      <ImagePreviewContainer style={{ backgroundImage: `url('${IPFS_GATEWAY}/ipfs/${cid}')` }} />

      <div>{cid}</div>
      <div>({type})</div>

      <DropdownButton options={options} />
    </Container>
  )
}

export default ImagePreview
