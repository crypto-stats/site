import { useEffect, useState } from 'react'
import { generateContractFile, generateSchemaFile } from 'utils/graph-file-generator'
import { SubgraphData } from './local-subgraphs'
// @ts-ignore
import assemblyscriptGlobals from '!raw-loader!assemblyscript/std/assembly/index.d.ts'

export const useGeneratedFiles = (subgraph: SubgraphData | null) => {
  const [files, setFiles] = useState<{ content: string; filePath: string }[]>([])

  const generateFiles = async (subgraph: SubgraphData) => {
    const _files: { content: string; filePath: string }[] = [
      { filePath: 'file:///assembly.d.ts', content: assemblyscriptGlobals },
    ]

    const schemaCode = await generateSchemaFile(subgraph.schema)
    _files.push({ content: schemaCode, filePath: 'file:///schema.ts' })

    for (const contract of subgraph.contracts) {
      const content = await generateContractFile(contract.name, contract.abi)
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
