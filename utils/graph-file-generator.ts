import { Kind, NamedTypeNode, NonNullTypeNode, ObjectTypeDefinitionNode } from 'graphql'
import immutable from 'immutable'

export async function generateContractFile(abi: any) {
  // @ts-ignore
  const { default: ABI } = await import('@graphprotocol/graph-cli/src/protocols/ethereum/abi')

  const name = 'Test'
  const file = 'test.json'
  const abiWrapper = new ABI(name, file, immutable.fromJS(abi))
  const codegen = abiWrapper.codeGenerator()

  return [...codegen.generateModuleImports(), ...codegen.generateTypes()].join('\n')
}

export function generateContractHelpers(contractName: string, abi: any) {
  let code = '\n'
  const imports: string[] = []

  for (const item of abi) {
    if (item.type === 'event') {
      console.log(item)
      const adjustedName = `___cs_event_${item.name}`
      imports.push(`${item.name} as ${adjustedName}`)

      // for (const input of item.inputs) {
      // }

      code += `export function ___cs_generate_${contractName}_${item.name}(
        address: Address,
        logIndex: BigInt,
        transactionLogIndex: BigInt,
        logType: string | null,
        block: ___cs_graph_eth.Block,
        tx: ___cs_graph_eth.Transaction,
        params: Array<___cs_graph_eth.EventParam>,
      ): ${adjustedName} {
        return new ${adjustedName}(
          address,
          logIndex,
          transactionLogIndex,
          logType,
          block,
          tx,
          params,
        );
      }`
    }
    console.log(item)
  }

  const importLine = `import {${imports.join(',')}} from './contracts/${contractName}'`
  return `\n${importLine}\n${code}\n`
}

export async function generateSchemaFile(schemaCode: string) {
  const [gql, { default: SchemaCodeGenerator }] = await Promise.all([
    import('graphql/language'),
    // @ts-ignore
    import('@graphprotocol/graph-cli/src/codegen/schema'),
  ])

  const ast = immutable.fromJS(gql.parse(schemaCode))
  console.log(ast)

  const generator = new SchemaCodeGenerator({ ast })

  return [...generator.generateModuleImports(), ...generator.generateTypes()].join('\n')
}

function getRawType(type: string): string {
  switch (type) {
    case 'ID':
    case 'String':
      return 'string'

    default:
      console.warn(`Unknown type ${type}`)
      return type
  }
}

export async function generateSchemaASHelpers(schemaCode: string) {
  const gql = await import('graphql/language')
  const parsed = gql.parse(schemaCode)

  const imports: string[] = []

  let code = '\n'

  for (const definition of parsed.definitions) {
    if (definition.kind === Kind.OBJECT_TYPE_DEFINITION) {
      const entityDefinition = definition as ObjectTypeDefinitionNode
      const name = entityDefinition.name.value
      const adjustedName = `___cs_entity_${name}`
      const plainClassName = `___cs_entity_plain_${name}`

      imports.push(`${name} as ${adjustedName}`)

      let plainClassDef = `class ${plainClassName} {\n`
      let getterClassDef = `export function ___cs_get${name}(entity: ${adjustedName}): ${plainClassName} {
        return {\n`

      for (const field of entityDefinition.fields || []) {
        const type = getRawType(((field.type as NonNullTypeNode).type as NamedTypeNode).name.value)
        plainClassDef += `${field.name.value}: ${type};\n`
        getterClassDef += `${field.name.value}: entity.${field.name.value},\n`
      }

      code += `${plainClassDef}}\n\n${getterClassDef}};\n}\n`
    }
  }

  const importLine = `import {${imports.join(',')}} from './schema';`
  return `${importLine}\n${code}`
}
