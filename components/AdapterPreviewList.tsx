import React, { useEffect } from 'react'
import { useCompiler } from 'hooks/compiler'
import AdapterPreview from './AdapterPreview'

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
    <div>
      {staticDetails.map((details: any, i: number) => (
        <AdapterPreview
          details={details}
          adapter={list?.getAdapters()[i] || null}
        />
      ))}
    </div>
  )
}

export default AdapterPreviewList
