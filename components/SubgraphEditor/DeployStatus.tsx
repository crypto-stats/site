import { DeployStatus, STATUS } from 'utils/deploy-subgraph'

const DeployStatusComponent: React.FC<{ status: DeployStatus | null }> = ({ status }) => {
  if (!status) {
    return null
  }

  switch (status.status) {
    case STATUS.INITIALIZING:
      return <div>Initializing...</div>
    case STATUS.IPFS_UPLOAD:
      return (
        <div>
          <div>Uploading to IPFS...</div>
          {status.file && <div>{status.file}</div>}
        </div>
      )
    case STATUS.DEPLOYING:
      return <div>Deploying to indexer...</div>
  }
  return null
}

export default DeployStatusComponent
