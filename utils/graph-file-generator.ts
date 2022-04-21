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
