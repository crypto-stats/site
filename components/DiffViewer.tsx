import React from 'react'
import { ReactGhLikeDiff } from 'react-gh-like-diff'
import 'react-gh-like-diff/dist/css/diff2html.min.css'

interface DiffViewerProps {
  fileA: string
  fileB: string
  fileAName?: string | null
  fileBName?: string | null
}

const DiffViewer: React.FC<DiffViewerProps> = ({
  fileA,
  fileAName = 'Unnamed',
  fileB,
  fileBName = 'Unnamed',
}) => {
  return (
    <ReactGhLikeDiff
      past={fileA}
      current={fileB}
      options={{
        originalFileName: fileAName,
        updatedFileName: fileBName,
        drawFileList: false,
      }}
    />
  )
}

export default DiffViewer
