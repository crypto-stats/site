import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px;
`

const Button = styled.button`
  display: flex;
  width: 24px;
  height: 24px;
  padding: 4px;
  background: transparent;
  border: none;
  align-items: stretch;
  color: #acabab;
  margin: 4px;
  border-radius: 50%;
  cursor: pointer;

  &:disabled {
    color: #4a4a4a;
    cursor: unset;
  }

  &:hover {
    background: #444;
  }

  &:hover:disabled {
    background: transparent;
  }
`

const EditorControls: React.FC<{ editorRef: any }> = ({ editorRef }) => {
  const versions = useRef({
    currentVersion: 0,
    initialVersion: 0,
    lastVersion: 0,
  })
  const [undoEnabled, setUndoEnabled] = useState(false)
  const [redoEnabled, setRedoEnabled] = useState(false)

  useEffect(() => {
    if (editorRef.current) {
      versions.current.initialVersion = editorRef.current.getModel().getAlternativeVersionId()

      const disposable = editorRef.current.onDidChangeModelContent(() => {
        const versionId = editorRef.current.getModel().getAlternativeVersionId()
        const { currentVersion, initialVersion, lastVersion } = versions.current

        // undoing
        if (versionId < currentVersion) {
          setRedoEnabled(true)
          // no more undo possible
          if (versionId === initialVersion) {
            setUndoEnabled(false)
          }
        } else {
          // redoing
          if (versionId <= lastVersion) {
            // redoing the last change
            if (versionId == lastVersion) {
              setRedoEnabled(false)
            }
          } else {
            // adding new change, disable redo when adding new changes
            setRedoEnabled(false)
            if (currentVersion > lastVersion) {
              versions.current.lastVersion = currentVersion
            }
          }
          setUndoEnabled(true)
        }
        versions.current.currentVersion = versionId
      })
      return () => disposable.dispose()
    }
  }, [editorRef.current])

  return (
    <Container>
      <Button disabled={!undoEnabled} onClick={() => editorRef.current.trigger("controls", "undo")}>
        <svg
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          version='1.1'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <polyline transform='translate(1.2578 5.4846)' points='1 4 1 10 7 10' />
          <path d='m21.748 14.485c-2.2082-6.2402-10.171-8.0418-14.85-3.36l-4.64 4.36' />
        </svg>
      </Button>

      <Button disabled={!redoEnabled} onClick={() => editorRef.current.trigger("controls", "redo")}>
        <svg
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          version='1.1'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <polyline transform='matrix(-1 0 0 1 22.742 5.4846)' points='1 4 1 10 7 10' />
          <path d='m2.2522 14.485c2.2082-6.2402 10.171-8.0418 14.85-3.36l4.64 4.36' />
        </svg>
      </Button>
    </Container>
  )
}

export default EditorControls
