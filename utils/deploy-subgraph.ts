import { DEFAULT_MAPPING, SubgraphData } from 'hooks/local-subgraphs'
import { generateContractFile, generateSchemaFile } from './graph-file-generator'

export enum STATUS {
  INITIALIZING,
  COMPILING,
  IPFS_UPLOAD,
  DEPLOYING,
  COMPLETE,
  ERROR,
}

async function uploadToIPFS(file: string | Uint8Array, name: string) {
  const body =
    file instanceof Uint8Array
      ? {
          file: Buffer.from(file).toString('base64'),
          encoding: 'base64',
          name,
        }
      : { file, name }

  const req = await fetch('/api/graph/upload-file', {
    method: 'POST',
    body: JSON.stringify(body),
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

export interface DeployStatus {
  status: STATUS
  file?: string
  url?: string
  errorMessage?: string
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
): AsyncGenerator<DeployStatus> {
  yield {
    status: STATUS.INITIALIZING,
  }

  const yaml = await import('js-yaml')
  const { compileAs } = await import('./as-compiler')

  yield {
    status: STATUS.COMPILING,
  }

  const libraries: { [name: string]: string } = {}

  for (const contract of subgraph.contracts) {
    const code = await generateContractFile(contract.abi)
    libraries[`contracts/${contract.name}.ts`] = code
  }

  libraries['schema/index.ts'] = await generateSchemaFile(subgraph.schema)

  const compiled = await compileAs(subgraph.mappings[DEFAULT_MAPPING], { libraries })

  yield {
    status: STATUS.IPFS_UPLOAD,
    file: 'Mapping',
  }

  const mappingCID = await uploadToIPFS(compiled, 'mapping.wasm')

  const dataSources: any[] = []

  for (const contract of subgraph.contracts) {
    yield {
      status: STATUS.IPFS_UPLOAD,
      file: `${contract.name} Contract`,
    }

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

  yield {
    status: STATUS.IPFS_UPLOAD,
    file: 'Schema',
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

  yield {
    status: STATUS.IPFS_UPLOAD,
    file: 'Manifest',
  }

  const manifestCID = await uploadToIPFS(manifestString, 'manifest.yaml')

  yield {
    status: STATUS.DEPLOYING,
  }

  const deployResult = await deployHosted(subgraphName, manifestCID, deployKey)

  yield {
    status: STATUS.COMPLETE,
    url: deployResult.queries,
  }
}
