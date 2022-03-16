import React, { useEffect, useState } from 'react'
import EditorModal from '../EditorModal'
import ImagePreview from './ImagePreview'
import ImageGalery from './ImageGalery'

interface ImageLibraryProps {
  open: boolean
  close: () => void
  editor?: any
}

const ImageLibrary: React.FC<ImageLibraryProps> = ({ open, close, editor }) => {
  const [selectedImage, setSelectedImage] = useState<null | { cid: string; type: string }>(null)

  useEffect(() => {
    if (!open && selectedImage) {
      setSelectedImage(null)
    }
  }, [open])

  return (
    <EditorModal
      isOpen={open}
      onClose={close}
      title='Image Library'
      buttons={[{ label: 'Return to Editor', onClick: close }]}
      width='100%'
      height='70%'
      onBack={selectedImage ? () => setSelectedImage(null) : null}
    >
      {selectedImage ? (
        <ImagePreview
          editor={editor}
          cid={selectedImage.cid}
          type={selectedImage.type}
          close={close}
        />
      ) : (
        <ImageGalery onSelectedImage={setSelectedImage} />
      )}
    </EditorModal>
  )
}

export default ImageLibrary
