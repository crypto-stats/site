import { useEffect, useState } from 'react'
import {
  generateContractFile,
  generateSchemaFile,
  generateTemplateFile,
} from 'utils/graph-file-generator'
import { SubgraphData } from './local-subgraphs'
// @ts-ignore
import assemblyscriptGlobals from '!raw-loader!assemblyscript/std/assembly/index.d.ts'
import { templates } from 'resources/subgraph-templates'

export const useGeneratedFiles = (subgraph: SubgraphData | null) => {
  const [files, setFiles] = useState<{ content: string; filePath: string }[]>([])

  const generateFiles = async (subgraph: SubgraphData) => {
    const _files: { content: string; filePath: string }[] = [
      { filePath: 'file:///assembly.d.ts', content: assemblyscriptGlobals },
    ]

    const schemaCode = await generateSchemaFile(subgraph.schema)
    _files.push({ content: schemaCode, filePath: 'file:///schema.ts' })

    for (const contract of subgraph.contracts) {
      try {
        const content = await generateContractFile(contract.name, contract.abi)
        _files.push({ content, filePath: `file:///contracts/${contract.name}.ts` })

        if (contract.isTemplate) {
          const template = await generateTemplateFile(contract.name)
          _files.push({ content: template, filePath: `file:///templates/${contract.name}.ts` })
        }
      } catch (e) {
        console.error(`Error generating file for ${contract.name}: ${e.message}`)
      }
    }

    for (const templateId of subgraph.templates || []) {
      const template = templates.find(template => template.id === templateId)
      if (!template) {
        console.warn(`Contract template ${templateId} not found`)
        continue
      }
      const code = await generateContractFile(template.id, template.abi)
      _files.push({ filePath: `file:///contracts/${template.id}.ts`, content: code })
      const templateCode = await generateTemplateFile(template.id)
      _files.push({ filePath: `file:///templates/${template.id}.ts`, content: templateCode })
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
