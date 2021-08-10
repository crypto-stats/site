import React, { Fragment, useRef } from 'react';

interface FileUploadButtonProps {
  onUploaded: (cid: string, type: string, name: string) => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onUploaded }) => {
  const hiddenFileInput = useRef<HTMLInputElement | null>(null)

  const handleChange = async (event: any) => {
    const fileUploaded = event.target.files[0]

    console.log(fileUploaded)

    const req = await fetch('/api/upload-image', {
      method: 'POST',
      body: fileUploaded,
      headers: {
        type: fileUploaded.type,
        name: fileUploaded.name,
      },
    })
    const { cid } = await req.json()
    onUploaded(cid, fileUploaded.type, fileUploaded.name)
  };

  return (
    <Fragment>
      <button onClick={() => hiddenFileInput.current!.click()}>
        Upload a file
      </button>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{display: 'none'}}
      />
    </Fragment>
  )
}

export default FileUploadButton
