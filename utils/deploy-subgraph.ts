import { ContractEvent, DEFAULT_MAPPING, SubgraphData } from 'hooks/local-subgraphs'
import { generateContractFile, generateSchemaFile } from './graph-file-generator'
import Hash from 'ipfs-only-hash'

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

  if (!json.success) {
    throw new Error(json.error)
  }
  return json.cid
}

export async function compileAs(file: string, libraries: { [name: string]: string }) {
  const req = await fetch('/api/graph/compile-as', {
    method: 'POST',
    body: JSON.stringify({ file, libraries }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const json = await req.json()

  if (!json.success) {
    throw new Error(json.error)
  }

  const bytecode = Buffer.from(json.bytecode, 'base64')

  return bytecode
}

async function deployHosted(
  node: string,
  name: string,
  cid: string,
  deployKey: string,
  version_label: string
) {
  const req = await fetch(node, {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'subgraph_deploy',
      params: {
        name,
        ipfs_hash: cid,
        version_label,
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
    throw new Error(`Subgraph deploy failed: ${json.error.message || JSON.stringify(json.error)}`)
  }
  return json.result
}

export interface DeployStatus {
  status: STATUS
  file?: string
  url?: string
  errorMessage?: string
}

interface DeployOptions {
  node: string
  subgraphName: string
  deployKey: string
}

export interface DeployFile {
  title: string
  filename: string
  value: string | Uint8Array
  cid: string
}

const getCID = (value: string | Buffer): Promise<string> => {
  const buffer: Buffer = typeof value === 'string' ? Buffer.from(value) : value
  return Hash.of(buffer)
}

export async function prepareSubgraphDeploymentFiles(subgraph: SubgraphData) {
  const files: DeployFile[] = []

  const yaml = await import('js-yaml')
  // @ts-ignore
  const { default: ABI } = await import('@graphprotocol/graph-cli/src/protocols/ethereum/abi')
  const immutable = await import('immutable')

  const getGraphEvent = (abi: any[], signature: string) => {
    for (const item of abi) {
      if (item.type === 'event') {
        const params = item.inputs.map(
          (ei: any) => `${ei.indexed ? 'indexed ' : ''}${ei.type} ${ei.name}`
        )
        const longSignature = `${item.name}(${params.join(', ')})`

        if (longSignature === signature) {
          return ABI.eventSignature(immutable.fromJS(item))
        }
      }
    }
    throw new Error(`Couldn't find event ${signature} in ABI`)
  }

  const libraries: { [name: string]: string } = {}

  for (const contract of subgraph.contracts) {
    const code = await generateContractFile(contract.name, contract.abi)
    libraries[`contracts/${contract.name}.ts`] = code
  }

  libraries['schema/index.ts'] = await generateSchemaFile(subgraph.schema)

  const compiled = await compileAs(subgraph.mappings[DEFAULT_MAPPING], libraries)

  const mappingCid = await getCID(compiled)

  files.push({
    title: 'Mapping',
    filename: 'mapping.wasm',
    value: compiled,
    cid: mappingCid,
  })

  const sourceCid = await getCID(subgraph.mappings[DEFAULT_MAPPING])

  files.push({
    title: 'Mapping - mapping.ts',
    filename: 'mapping.ts',
    value: subgraph.mappings[DEFAULT_MAPPING],
    cid: sourceCid,
  })

  const dataSources: any[] = []

  for (const contract of subgraph.contracts) {
    const abiString = JSON.stringify(contract.abi)
    const cid = await getCID(abiString)

    files.push({
      title: contract.name,
      filename: `${contract.name}.json`,
      value: abiString,
      cid,
    })

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
        apiVersion: '0.0.7',
        entities: ['Pair'],
        eventHandlers: contract.events.map((event: ContractEvent) => ({
          event: getGraphEvent(contract.abi, event.signature),
          handler: event.handler,
          receipt: !!event.receipt,
        })),
        file: {
          '/': `/ipfs/${mappingCid}`,
        },
        kind: 'ethereum/events',
        language: 'wasm/assemblyscript',
      },
    })
  }

  const schemaCid = await getCID(subgraph.schema)

  files.push({
    title: 'Schema',
    filename: 'schema.graphql',
    value: subgraph.schema,
    cid: schemaCid,
  })

  const manifestString = yaml.dump({
    specVersion: '0.0.5',
    description: 'Test description',
    dataSources,
    schema: {
      file: {
        '/': `/ipfs/${schemaCid}`,
      },
    },
    sourceCode: [
      {
        name: 'mapping.ts',
        file: `/ipfs/${mappingCid}`,
        source: `/ipfs/${sourceCid}`,
      },
    ],
  })

  files.push({
    title: 'Manifest',
    filename: 'manifest.yaml',
    value: manifestString,
    cid: await getCID(manifestString),
  })

  return files
}

export async function deployPreparedSubgraph(
  subgraph: SubgraphData,
  files: DeployFile[],
  options: DeployOptions
) {
  let manifestCid: string | null = null
  for (const file of files) {
    const cid = await uploadToIPFS(file.value, file.filename)
    if (cid !== file.cid) {
      throw new Error(
        `Uploaded CID ${cid} didn't match expected CID ${file.cid} for ${file.filename}`
      )
    }
    if (file.filename === 'manifest.yaml') {
      manifestCid = cid
    }
  }

  if (!manifestCid) {
    throw new Error('No manifest found in files')
  }

  const deployResult = await deployHosted(
    options.node,
    options.subgraphName,
    manifestCid,
    options.deployKey,
    subgraph.version
  )
  return deployResult
}

export async function* deploySubgraph(
  subgraph: SubgraphData,
  { node, subgraphName, deployKey }: DeployOptions
): AsyncGenerator<DeployStatus> {
  yield {
    status: STATUS.INITIALIZING,
  }

  const yaml = await import('js-yaml')
  // @ts-ignore
  const { default: ABI } = await import('@graphprotocol/graph-cli/src/protocols/ethereum/abi')
  const immutable = await import('immutable')

  const getGraphEvent = (abi: any[], signature: string) => {
    for (const item of abi) {
      if (item.type === 'event') {
        const params = item.inputs.map(
          (ei: any) => `${ei.indexed ? 'indexed ' : ''}${ei.type} ${ei.name}`
        )
        const longSignature = `${item.name}(${params.join(', ')})`

        if (longSignature === signature) {
          return ABI.eventSignature(immutable.fromJS(item))
        }
      }
    }
    throw new Error(`Couldn't find event ${signature} in ABI`)
  }

  yield {
    status: STATUS.COMPILING,
  }

  const libraries: { [name: string]: string } = {}

  for (const contract of subgraph.contracts) {
    const code = await generateContractFile(contract.name, contract.abi)
    libraries[`contracts/${contract.name}.ts`] = code
  }

  libraries['schema/index.ts'] = await generateSchemaFile(subgraph.schema)

  const compiled = await compileAs(subgraph.mappings[DEFAULT_MAPPING], libraries)

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
        apiVersion: '0.0.7',
        entities: ['Pair'],
        eventHandlers: contract.events.map((event: { signature: string; handler: string }) => ({
          event: getGraphEvent(contract.abi, event.signature),
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
    specVersion: '0.0.5',
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

  const deployResult = await deployHosted(
    node,
    subgraphName,
    manifestCID,
    deployKey,
    subgraph.version
  )

  yield {
    status: STATUS.COMPLETE,
    url: deployResult.queries,
  }
}
