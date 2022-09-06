import { SubgraphData } from 'hooks/local-subgraphs'
import immutable from 'immutable'
import { templates } from 'resources/subgraph-templates'

export async function generateLibrariesForSubgraph(
  subgraph: SubgraphData,
  { prefix = '', failSilently = false } = {}
) {
  const libraries: { [name: string]: string } = {}

  for (const contract of subgraph.contracts) {
    try {
      const code = await generateContractFile(contract.name, contract.abi)
      libraries[`${prefix}contracts/${contract.name}.ts`] = code
      if (contract.isTemplate) {
        const template = await generateTemplateFile(contract.name)
        libraries[`${prefix}templates/${contract.name}.ts`] = template
      }
    } catch (e: any) {
      if (failSilently) {
        console.error(`Error generating file for ${contract.name}: ${e.message}`)
      } else {
        throw e
      }
    }
  }

  for (const templateId of subgraph.templates || []) {
    const template = templates.find(template => template.id === templateId)
    if (!template) {
      console.warn(`Contract template ${templateId} not found`)
      continue
    }
    const code = await generateContractFile(template.id, template.abi)
    libraries[`${prefix}contracts/${template.id}.ts`] = code
    const templateCode = await generateTemplateFile(template.id)
    libraries[`${prefix}templates/${template.id}.ts`] = templateCode
  }

  try {
    libraries[`${prefix}schema/index.ts`] = await generateSchemaFile(subgraph.schema)
  } catch (e: any) {
    if (failSilently) {
      console.error(`Error generating schema: ${e.message}`)
    } else {
      throw e
    }
  }

  return libraries
}

export async function generateContractFile(name: string, abi: any) {
  // @ts-ignore
  const { default: ABI } = await import('@graphprotocol/graph-cli/src/protocols/ethereum/abi')

  const file = 'test.json'
  const abiWrapper = new ABI(name, file, immutable.fromJS(abi))
  const codegen = abiWrapper.codeGenerator()

  return [...codegen.generateModuleImports(), ...codegen.generateTypes()].join('\n')
}

export async function generateTemplateFile(name: string) {
  const { default: Template } = await import(
    // @ts-ignore
    '@graphprotocol/graph-cli/src/protocols/ethereum/codegen/template'
  )
  const { default: DataSourceTemplateCodeGenerator } = await import(
    // @ts-ignore
    '@graphprotocol/graph-cli/src/codegen/template'
  )

  const templateData = { get: () => name }
  const template = new Template(templateData)
  const codegen = new DataSourceTemplateCodeGenerator(templateData, {
    getTemplateCodeGen: () => template,
  })

  return [...codegen.generateModuleImports(), ...codegen.generateTypes()].join('\n')
}

export async function generateSchemaFile(schemaCode: string) {
  const [gql, { default: SchemaCodeGenerator }] = await Promise.all([
    import('graphql/language'),
    // @ts-ignore
    import('@graphprotocol/graph-cli/src/codegen/schema'),
  ])

  const ast = immutable.fromJS(gql.parse(schemaCode))

  const generator = new SchemaCodeGenerator({ ast })

  return [...generator.generateModuleImports(), ...generator.generateTypes()].join('\n')
}
