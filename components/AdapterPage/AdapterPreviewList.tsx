import React, { useEffect } from 'react'
import { useCompiler } from 'hooks/compiler'
import AdapterPreview from './AdapterPreview'
import styled from 'styled-components'

const PreviewContainer = styled.div`
  margin-top: 24px;
`

interface AdapterPreviewListProps {
  staticDetails: any[]
  code: string
}

const AdapterPreviewList: React.FC<AdapterPreviewListProps> = ({ staticDetails, code }) => {
  const { list, evaluate } = useCompiler()

  useEffect(() => {
    evaluate({ code })
  }, [code])

  return (
    <PreviewContainer>
      {staticDetails.map((details: any, i: number) => (
        <AdapterPreview
          key={details.id}
          details={details}
          adapter={list?.getAdapters()[i] || null}
          openByDefault={staticDetails.length === 1}
        />
      ))}
    </PreviewContainer>
  )
}

export default AdapterPreviewList
