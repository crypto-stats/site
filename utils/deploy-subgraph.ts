import { SubgraphData } from "hooks/local-subgraphs";

export enum STATUS {
  INITIALIZING,
  IPFS_UPLOAD,
  DEPLOYING,
  COMPLETE,
}

async function uploadToIPFS(file: string, name: string) {
  const req = await fetch('/api/graph/upload-file', {
    method: 'POST',
    body: JSON.stringify({ file, name }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const json = await req.json()
  return json.cid
}

async function deployHosted(name: string, cid: string, deployKey: string) {
  const req = await fetch('/api/graph/deploy', {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'subgraph_deploy',
      params: {
        name,
        ipfs_hash: cid,
      },
      id: 2,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + deployKey,
    },
  })

  const json = await req.json()
  if (json.error) {
    throw new Error(`Subgraph deploy failed: ${JSON.stringify(json.error)}`)
  }
  return json.result
}

export async function* deploySubgraph(_subgraph: SubgraphData, {
  subgraphName,
  deployKey,
}: {
  subgraphName: string,
  deployKey: string,
}) {
  yield {
    status: STATUS.INITIALIZING,
  }

  const yaml = await import('js-yaml')

  const manifestString = yaml.dump({
    specVersion: '0.0.2',
    description: 'Test description',
    dataSources: [
      {
        kind: 'ethereum/contract',
        name: 'UniV2Factory',
        network: 'mainnet',
        source: {
          abi: 'UniV2Factory',
          address: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
          startBlock: 10000835,
        },
        mapping: {
          abis: [
            {
              file: {
                '/': '/ipfs/QmZ55G1yYFzde8Vcq4cpLfNgPSEibpLi9aYCqS1jEvCKQ9',
              },
              name: 'UniV2Factory',
            },
          ],
          apiVersion: '0.0.5',
          entities: ['Pair'],
          eventHandlers: [
            {
              event: 'PairCreated(indexed address,indexed address,address,uint256)',
              handler: 'handlePairCreated',
            },
          ],
          file: {
            '/': '/ipfs/QmcL62o6kSWPShvLjd39VsTmHtiyABrTXD1fPdPobBHDsu',
          },
          kind: 'ethereum/events',
          language: 'wasm/assemblyscript',
        },
      },
    ],
    schema: {
      file: {
        '/': '/ipfs/QmehbLm5pEPQqDAdTdGid4zqe49FHUUq2MHEtHLiW2DiLd',
      },
    },
  })

  yield {
    status: STATUS.IPFS_UPLOAD,
  }

  const manifestCID = await uploadToIPFS(manifestString, 'manifest.yaml')

  yield {
    status: STATUS.DEPLOYING,
  }

  const deployResult = await deployHosted(subgraphName, manifestCID, deployKey)

  yield {
    status: STATUS.COMPLETE,
    data: deployResult,
  }
}
