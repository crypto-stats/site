import { SubgraphData } from 'hooks/local-subgraphs'

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

export async function* deploySubgraph(
  subgraph: SubgraphData,
  {
    subgraphName,
    deployKey,
  }: {
    subgraphName: string
    deployKey: string
  }
) {
  yield {
    status: STATUS.INITIALIZING,
  }

  const yaml = await import('js-yaml')

  yield {
    status: STATUS.IPFS_UPLOAD,
  }

  const mappingCID = 'QmcL62o6kSWPShvLjd39VsTmHtiyABrTXD1fPdPobBHDsu'

  const dataSources: any[] = []

  for (const contract of subgraph.contracts) {
    const cid = await uploadToIPFS(JSON.stringify(contract.abi), `${contract.name}.json`)

    dataSources.push({
      kind: 'ethereum/contract',
      name: contract.name,
      network: 'mainnet',
      source: {
        abi: contract.name,
        address: contract.addresses['1'],
        startBlock: contract.startBlocks['1'],
      },
      mapping: {
        abis: [
          {
            file: {
              '/': `/ipfs/${cid}`,
            },
            name: contract.name,
          },
        ],
        apiVersion: '0.0.5',
        entities: ['Pair'],
        eventHandlers: contract.events.map((event: { signature: string; handler: string }) => ({
          event: event.signature,
          handler: event.handler,
        })),
        file: {
          '/': `/ipfs/${mappingCID}`,
        },
        kind: 'ethereum/events',
        language: 'wasm/assemblyscript',
      },
    })
  }

  const schemaCID = await uploadToIPFS(subgraph.schema, 'schema.graphql')

  const manifestString = yaml.dump({
    specVersion: '0.0.2',
    description: 'Test description',
    dataSources,
    schema: {
      file: {
        '/': `/ipfs/${schemaCID}`,
      },
    },
  })

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
