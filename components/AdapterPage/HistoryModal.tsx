import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export interface HistoricalVersion {
  cid: string
  version: string | null
}

interface AdapterHistoryProps {
  historicalVersions: HistoricalVersion[]
}

const AdapterHistory: React.FC<AdapterHistoryProps> = ({ historicalVersions }) => {
  const router = useRouter()

  return (
    <div>
      <ul>
        {historicalVersions.map((version: HistoricalVersion) => (
          <li key={version.cid}>
            <Link href={`/discover/${router.query.listId}/${version.cid}`}>
              <a>{version.version || 'Unversioned'}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdapterHistory
