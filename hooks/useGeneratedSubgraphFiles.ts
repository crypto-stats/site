import { useEffect, useState } from 'react'
import { Contract } from './useLocalSubgraph'
import immutable from 'immutable'

async function generateSchemaFile(schemaCode: string) {
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

export const useGeneratedSubgraphFiles = (schema?: string, _mappings?: Contract[]) => {
  const [schemaFile, setSchemaFile] = useState<null | string>(null)

  useEffect(() => {
    if (schema) {
      generateSchemaFile(schema)
        .then((generatedSchema: string) => setSchemaFile(generatedSchema))
        .catch((e: any) => console.warn(e))
    }
  }, [schema])

  return schemaFile ? [{ name: 'schema.ts', code: schemaFile }] : []
}
