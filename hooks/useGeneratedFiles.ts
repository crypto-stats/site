import { useEffect, useState } from 'react'
import { generateContractFile } from 'utils/graph-file-generator'
import { SubgraphData } from './local-subgraphs'

export const useGeneratedFiles = (subgraph: SubgraphData | null) => {
  const [files, setFiles] = useState<{ content: string; filePath: string }[]>([])

  useEffect(() => {
    if (subgraph) {
      console.log('starting')
      ;(async () => {
        const _files: { content: string; filePath: string }[] = []
        for (const contract of subgraph.contracts) {
          const content = await generateContractFile(contract.abi)
          _files.push({ content, filePath: `file:///contracts/${contract.name}.ts` })
        }
        setFiles(_files)
      })()
    } else {
      setFiles([])
    }
  }, [subgraph?.contracts])

  return files
}
