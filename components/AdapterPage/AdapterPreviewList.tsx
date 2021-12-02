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

  console.log(list)

  return (
    <div>
      {staticDetails.map((details: any, i: number) => (
        <AdapterPreview
          key={details.id}
          details={details}
          adapter={list?.getAdapters()[i] || null}
          openByDefault={staticDetails.length === 1}
        />
      ))}
    </div>
  )
}

export default AdapterPreviewList
