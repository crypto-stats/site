import { useEffect, useState } from 'react'
import { generateContractFile, generateSchemaFile } from 'utils/graph-file-generator'
import { SubgraphData } from './local-subgraphs'

export const useGeneratedFiles = (subgraph: SubgraphData | null) => {
  const [files, setFiles] = useState<{ content: string; filePath: string }[]>([])

  const generateFiles = async (subgraph: SubgraphData) => {
    const _files: { content: string; filePath: string }[] = []

    const schemaCode = await generateSchemaFile(subgraph.schema)
    _files.push({ content: schemaCode, filePath: 'file:///schema.ts' })

    for (const contract of subgraph.contracts) {
      const content = await generateContractFile(contract.abi)
      _files.push({ content, filePath: `file:///contracts/${contract.name}.ts` })
    }
    setFiles(_files)
  }

  useEffect(() => {
    if (subgraph) {
      generateFiles(subgraph)
    } else {
      setFiles([])
    }
  }, [subgraph?.contracts])

  return files
}
