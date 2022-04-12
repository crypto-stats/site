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
