import { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { SubgraphData } from './local-subgraphs'
import { ethers } from 'ethers'
import { prepareSubgraphDeploymentFiles, deployPreparedSubgraph } from 'utils/deploy-subgraph'
import Hash from 'ipfs-only-hash'

export interface PublishConfig {
  name: string
  accessToken: string
  network: 'ethereum'
  node: 'hosted' | 'studio'
}

export interface DeployFile {
  title: string
  filename: string
  value: string | Uint8Array
  cid: string
}

interface DeployState {
  files: DeployFile[] | null
  status: DeployStatus
}

export enum DeployStatus {
  NOT_READY,
  READY_TO_PREPARE,
  PREPARING,
  READY_TO_SIGN,
  SIGNATURE_PENDING,
  READY_TO_DEPLOY,
  DEPLOYING,
  DEPLOY_COMPLETE,
  ERROR,
}

const DEFAULT_DEPLOY_STATE: DeployState = {
  files: null,
  status: DeployStatus.READY_TO_PREPARE,
}

export const useSubgraphDeployment = (subgraph?: SubgraphData | null) => {
  const { library, account } = useWeb3React()
  const [deployState, setDeployState] = useState(DEFAULT_DEPLOY_STATE)

  if (!subgraph) {
    const throwSubgraphMissing = async () => {
      throw new Error('No subgraph provided')
    }

    return {
      status: DeployStatus.NOT_READY,
      prepareFiles: throwSubgraphMissing,
      signSubgraph: throwSubgraphMissing,
      deploy: throwSubgraphMissing,
    }
  }

  const findFile = (filename: string): [string, number] => {
    if (!deployState.files) {
      throw new Error(`Files not prepared yet`)
    }
    for (let i = 0; i < deployState.files.length; i += 1) {
      if (deployState.files[i].filename === filename) {
        return [deployState.files[i].value as string, i]
      }
    }
    throw new Error(`Couldn't find file ${filename}`)
  }

  const prepareFiles = async () => {
    setDeployState({ files: null, status: DeployStatus.PREPARING })
    const files = await prepareSubgraphDeploymentFiles(subgraph)
    setDeployState({ files, status: DeployStatus.READY_TO_SIGN })
  }

  const signSubgraph = async () => {
    setDeployState(_state => ({ ..._state, status: DeployStatus.SIGNATURE_PENDING }))

    const [manifestCode, index] = findFile('manifest.yaml')
    const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(manifestCode))
    const message = `Subgraph hash: ${hash}`
    const signature = await library.getSigner().signMessage(message)

    const newManifestCode = `${manifestCode}
signer: ${account}
signature: ${signature}`

    const newFiles = [...deployState.files!]
    newFiles[index] = {
      ...deployState.files![index],
      value: newManifestCode,
      cid: await Hash.of(Buffer.from(newManifestCode)),
    }

    setDeployState({ files: newFiles, status: DeployStatus.READY_TO_DEPLOY })
  }

  const deploy = async (options: PublishConfig) => {
    if (!deployState.files) {
      throw new Error('Files not prepares')
    }
    setDeployState(_state => ({ ..._state, status: DeployStatus.DEPLOYING }))

    const node =
      options.node === 'hosted' ? '/api/graph/deploy' : 'https://api.studio.thegraph.com/deploy/'

    const result = await deployPreparedSubgraph(subgraph, deployState.files, {
      node,
      subgraphName: options.name,
      deployKey: options.accessToken,
    })

    setDeployState(_state => ({ ..._state, status: DeployStatus.DEPLOY_COMPLETE }))
    return result
  }

  return { status: deployState.status, prepareFiles, signSubgraph, deploy }
}
