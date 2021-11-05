import React, { useState, useEffect } from 'react'
import { NextPage } from 'next'
import Link from 'next/link';
import Editor from 'components/Editor'
import { getListNames, getModulesForList } from 'utils/lists'
import styled from 'styled-components'
import FileList from 'components/FileList'
import { useAdapter, newModule } from 'hooks/local-adapters'
import { ViewPort, Top, LeftResizable, Fill, RightResizable, CenterType, Bottom } from 'react-spaces';

const Left = styled(LeftResizable)`
  display: flex;
  flex-direction: column;
`

const NewAdapterButton = styled.button``

const EditorPage: NextPage = () => {
  const [fileName, setFileName] = useState(null);
  const { save, publish, adapter } = useAdapter(fileName)

  useEffect(() => {
    setFileName('8a0c')
  }, [])
  if (!fileName || !adapter) {
    return null;
  }

  return (
    <ViewPort>
      <Top size={25} order={1} centerContent={CenterType.Vertical}>
        Top
      </Top>
      <Fill>
        <Left size={200}>
          <Fill>
            <FileList selected={fileName} onSelected={setFileName} />
          </Fill>

          <Bottom size={30}>
            <NewAdapterButton onClick={() => setFileName(newModule())}>New Adapter</NewAdapterButton>
          </Bottom>
        </Left>

        <Fill>
          <Top size={30}>
            Top
          </Top>

          <Fill>
            <Editor
              fileId={fileName}
              defaultValue={adapter.code}
              onChange={(code: string) => {
                save(code, adapter.name)
              }}
            />
          </Fill>

          <Bottom size={50}>
            Error
          </Bottom>
        </Fill>

        <RightResizable size={200}>
          <button
            disabled={fileName === "script.js"}
            onClick={() => setFileName("script.js")}
          >
            script.js
          </button>
          <button
            disabled={fileName === "style.css"}
            onClick={() => setFileName("style.css")}
          >
            style.css
          </button>
          <button
            disabled={fileName === "index.html"}
            onClick={() => setFileName("index.html")}
          >
            index.html
          </button>
        </RightResizable>
      </Fill>
    </ViewPort>
  )
}

export default EditorPage
