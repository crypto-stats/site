import React from 'react'
import { ReactGhLikeDiff } from 'react-gh-like-diff'
import 'react-gh-like-diff/dist/css/diff2html.min.css'

interface DiffViewerProps {
  fileA: string
  fileB: string
}

const DiffViewer: React.FC<DiffViewerProps> = ({ fileA, fileB }) => {
  return (
    <ReactGhLikeDiff
      past={fileA}
      current={fileB}
      options={{
        // originalFileName: "Test A",
        // updatedFileName: "Test B",
        drawFileList: false,
      }}
    />
  )
}

export default DiffViewer
